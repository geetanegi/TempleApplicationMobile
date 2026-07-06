import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Image,
  Platform,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { openUserProfile } from '../../../utils/navigation/openUserProfile';
import Video from 'react-native-video';
import { Plus, Heart, MessageCircle, Send, User, X, MoreVertical, Trash2 } from 'lucide-react-native';
import ReelCommentsOverlay from './ReelCommentsOverlay';
import Share from 'react-native-share';
import { getUserId } from '../../../redux/store/getState';
import {
  getReelsFeed,
  getReelById,
  likeReel,
  unlikeReel,
  shareReel,
  unshareReel,
  deleteReel,
} from '../../../utils/apicalls/reelHandler';
import {
  getFollowing,
  createOrGetChatThread,
  sendChatMessage,
} from '../../../utils/apicalls/socialHandler';
import {
  getProfilePictureUrlByUserId,
  resolveProfilePictureUrl,
} from '../../../utils/apicalls/profileHandler';
import { colors } from '../../../global/theme';
import {
  consumePrefetchedReels,
  prefetchReels,
} from '../../../utils/reelsPrefetchService';

const PAGE_SIZE = 5;
const STATUS_BAR_OFFSET = Platform.OS === 'android' ? 56 : 0;

const ReelMediaClip = React.memo(({
  item,
  isActive,
  isNearby,
  isFocused,
  width,
  height,
}) => {
  const [videoReady, setVideoReady] = useState(false);
  const showPlayer = isFocused && isNearby;

  useEffect(() => {
    setVideoReady(false);
  }, [item.id, item.videoUrl]);

  const mediaStyle = [styles.videoFill, { width, height }];
  const showThumbnail = Boolean(item.thumbnailUrl) && (!showPlayer || !videoReady);

  return (
    <View style={[styles.videoClip, { width, height }]} collapsable={false}>
      {showThumbnail ? (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={mediaStyle}
          resizeMode="contain"
          fadeDuration={0}
        />
      ) : null}
      {showPlayer ? (
        <Video
          source={{ uri: item.videoUrl }}
          style={[mediaStyle, { opacity: videoReady ? 1 : 0 }]}
          resizeMode="contain"
          repeat
          paused={!isActive}
          controls={false}
          onReadyForDisplay={() => setVideoReady(true)}
          onLoad={() => setVideoReady(true)}
          bufferConfig={{
            minBufferMs: 10000,
            maxBufferMs: 30000,
            bufferForPlaybackMs: 500,
            bufferForPlaybackAfterRebufferMs: 1500,
          }}
        />
      ) : !item.thumbnailUrl ? (
        <View style={[mediaStyle, styles.videoPlaceholder]} />
      ) : null}
    </View>
  );
});

const ReelsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const initialReelId = route.params?.reelId;
  const topOffset = Platform.OS === 'android' ? Math.max(STATUS_BAR_OFFSET, insets.top) : insets.top;
  const reelItemHeight = Math.round(windowHeight - topOffset);
  const currentUserId = getUserId();

  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentReel, setCommentReel] = useState(null);
  const [menuReelId, setMenuReelId] = useState(null);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [shareTargetReel, setShareTargetReel] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [shareQuery, setShareQuery] = useState('');
  const [sendingToUserId, setSendingToUserId] = useState(null);

  const flatListRef = useRef(null);
  const initialLoadDoneRef = useRef(false);
  const lastLoadedReelIdRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const scrollStartIndexRef = useRef(0);

  const createClientMessageId = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  // ---- Data fetching (uses new /reels/feed endpoint) ----

  const loadFeed = useCallback(
    async (pageNum = 0, append = false) => {
      if (pageNum === 0 && !append) setLoading(true);
      else {
        setLoadingMore(true);
        loadingMoreRef.current = true;
      }
      try {
        const res = await getReelsFeed(pageNum, PAGE_SIZE, currentUserId);
        const feed = res?.data;
        const list = Array.isArray(feed?.reels) ? feed.reels : (Array.isArray(feed) ? feed : []);
        const serverHasMore = feed?.hasMore ?? list.length >= PAGE_SIZE;

        if (append) {
          setReels((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newItems = list.filter((r) => !ids.has(r.id));
            return [...prev, ...newItems];
          });
        } else {
          setReels(list);
        }
        setPage(pageNum);
        setHasMore(serverHasMore);
      } catch (err) {
        console.warn('Reels load error:', err);
        if (!append) setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        loadingMoreRef.current = false;
      }
    },
    [currentUserId],
  );

  // ---- Initial load: prefer prefetched data for instant display ----

  useFocusEffect(
    useCallback(() => {
      if (initialReelId || initialLoadDoneRef.current) return;
      initialLoadDoneRef.current = true;

      const prefetched = consumePrefetchedReels();
      if (prefetched && Array.isArray(prefetched.reels) && prefetched.reels.length > 0) {
        setReels(prefetched.reels);
        setPage(0);
        setHasMore(prefetched.hasMore ?? prefetched.reels.length >= PAGE_SIZE);
        setLoading(false);
        return;
      }

      loadFeed(0, false);
    }, [loadFeed, initialReelId]),
  );

  // ---- Load specific reel when navigated with reelId param ----

  useEffect(() => {
    if (!initialReelId) return;
    const reelIdStr = String(initialReelId);
    if (lastLoadedReelIdRef.current === reelIdStr) return;
    lastLoadedReelIdRef.current = reelIdStr;
    let cancelled = false;
    setLoading(true);
    initialLoadDoneRef.current = true;

    Promise.all([
      getReelById(initialReelId, currentUserId),
      getReelsFeed(0, PAGE_SIZE, currentUserId),
    ])
      .then(([reelRes, feedRes]) => {
        if (cancelled) return;
        const reelData = reelRes?.data;
        const feed = feedRes?.data;
        const feedList = Array.isArray(feed?.reels) ? feed.reels : (Array.isArray(feed) ? feed : []);
        const inFeed = feedList.some((r) => String(r.id) === reelIdStr);
        const list = inFeed
          ? feedList
          : reelData
            ? [{ ...reelData, id: reelData.id }, ...feedList]
            : feedList;
        setReels(list);
        setHasMore(feed?.hasMore ?? feedList.length >= PAGE_SIZE);
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('Reels load error:', err);
          setHasMore(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [initialReelId, currentUserId]);

  // Scroll to target reel after loading with reelId
  useEffect(() => {
    if (!initialReelId || reels.length === 0) return;
    const index = reels.findIndex((r) => String(r.id) === String(initialReelId));
    if (index < 0) return;
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: index * reelItemHeight,
        animated: false,
      });
      setActiveIndex(index);
      navigation.setParams({ reelId: undefined });
      lastLoadedReelIdRef.current = null;
    }, 200);
    return () => clearTimeout(timer);
  }, [initialReelId, reels, navigation, reelItemHeight]);

  // ---- Prefetch next batch when user is nearing the end ----

  const onEndReached = useCallback(() => {
    if (loadingMoreRef.current || !hasMore) return;
    loadFeed(page + 1, true);
  }, [page, loadFeed, hasMore]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    prefetchReels();
    loadFeed(0, false).finally(() => setRefreshing(false));
  }, [loadFeed]);

  // ---- Viewability tracking ----

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const getItemLayout = useCallback(
    (_, index) => ({
      length: reelItemHeight,
      offset: reelItemHeight * index,
      index,
    }),
    [reelItemHeight],
  );

  const handleMomentumScrollBegin = useCallback(() => {
    scrollStartIndexRef.current = activeIndex;
  }, [activeIndex]);

  const handleMomentumScrollEnd = useCallback(
    (event) => {
      const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
      const rawIndex = Math.round(offsetY / reelItemHeight);
      const startIndex = scrollStartIndexRef.current;
      const boundedIndex = Math.max(0, Math.min(reels.length - 1, rawIndex));
      const maxOneStepIndex = Math.max(
        0,
        Math.min(reels.length - 1, startIndex + (boundedIndex > startIndex ? 1 : boundedIndex < startIndex ? -1 : 0)),
      );

      if (maxOneStepIndex !== boundedIndex) {
        flatListRef.current?.scrollToOffset({
          offset: maxOneStepIndex * reelItemHeight,
          animated: true,
        });
      }
      if (maxOneStepIndex !== activeIndex) {
        setActiveIndex(maxOneStepIndex);
      }
    },
    [activeIndex, reels.length, reelItemHeight],
  );
  // ---- Interactions ----

  const handleLike = useCallback(
    async (reel) => {
      if (!currentUserId) return;
      const isLiked = !!reel.isLiked;
      const newCount = (reel.likesCount ?? 0) + (isLiked ? -1 : 1);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id ? { ...r, isLiked: !isLiked, likesCount: newCount } : r,
        ),
      );
      try {
        if (isLiked) await unlikeReel(reel.id, currentUserId);
        else await likeReel(reel.id, currentUserId);
      } catch {
        setReels((prev) =>
          prev.map((r) =>
            r.id === reel.id ? { ...r, isLiked, likesCount: reel.likesCount } : r,
          ),
        );
      }
    },
    [currentUserId],
  );

  const handleDeleteReel = useCallback(
    async (reel) => {
      const isOwn = currentUserId && String(reel.user?.id ?? reel.userId) === String(currentUserId);
      if (!isOwn) return;
      Alert.alert('Delete Reel', 'Are you sure you want to delete this reel?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReel(reel.id, currentUserId);
              setReels((prev) => prev.filter((r) => r.id !== reel.id));
              setCommentReel((c) => (c?.id === reel.id ? null : c));
            } catch (e) {
              Alert.alert(
                'Error',
                e?.response?.data?.message || e?.message || 'Failed to delete reel',
              );
            }
          },
        },
      ]);
    },
    [currentUserId],
  );

  const handleShare = useCallback(
    async (reel) => {
      if (!currentUserId) return;
      const isShared = !!reel.isShared;
      try {
        if (isShared) {
          await unshareReel(reel.id, currentUserId);
          const newCount = Math.max(0, (reel.sharesCount ?? 0) - 1);
          setReels((prev) =>
            prev.map((r) =>
              r.id === reel.id ? { ...r, isShared: false, sharesCount: newCount } : r,
            ),
          );
        } else {
          setShareTargetReel(reel);
          setShareSheetVisible(true);
          setShareQuery('');
          setLoadingFollowing(true);
          try {
            const res = await getFollowing(currentUserId);
            setFollowingUsers(Array.isArray(res?.data) ? res.data : []);
          } catch {
            setFollowingUsers([]);
          } finally {
            setLoadingFollowing(false);
          }
        }
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.message || e?.message || 'Share action failed');
      }
    },
    [currentUserId],
  );

  const markReelShared = useCallback(
    async (reel) => {
      if (!reel || !currentUserId) return;
      await shareReel(reel.id, currentUserId);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id
            ? { ...r, isShared: true, sharesCount: (r.sharesCount ?? 0) + 1 }
            : r,
        ),
      );
    },
    [currentUserId],
  );

  const handleSendToUser = useCallback(
    async (user) => {
      if (!shareTargetReel || !currentUserId) return;
      const otherUserId = user?.id ?? user?.userId;
      if (!otherUserId) return;

      const caption = (shareTargetReel.caption || '').trim();
      const reelDeepLink = `https://jainsansaar.app/reel/${shareTargetReel.id}`;
      const message = [caption ? `Check out this reel: ${caption}` : 'Check out this reel!', reelDeepLink]
        .filter(Boolean)
        .join('\n');

      setSendingToUserId(otherUserId);
      try {
        const threadRes = await createOrGetChatThread(currentUserId, otherUserId);
        const threadId = threadRes?.data?.id;
        if (!threadId) throw new Error('Chat thread not found');
        await sendChatMessage(threadId, currentUserId, createClientMessageId(), message, 'text');
        if (!shareTargetReel.isShared) await markReelShared(shareTargetReel);
        setShareSheetVisible(false);
        setShareTargetReel(null);
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to send reel');
      } finally {
        setSendingToUserId(null);
      }
    },
    [currentUserId, shareTargetReel, markReelShared],
  );

  const handleMoreOptionsShare = useCallback(async () => {
    if (!shareTargetReel || !currentUserId) return;
    const caption = (shareTargetReel.caption || '').trim();
    const reelDeepLink = `https://jainsansaar.app/reel/${shareTargetReel.id}`;
    const message = [caption ? `Check out this reel: ${caption}` : 'Check out this reel!', reelDeepLink]
      .filter(Boolean)
      .join('\n');

    try {
      await Share.open({
        message,
        url: reelDeepLink,
        title: 'Share Reel',
      });
      if (!shareTargetReel.isShared) await markReelShared(shareTargetReel);
    } catch (e) {
      if (e?.message !== 'User did not share') {
        Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to share');
      }
    }
  }, [shareTargetReel, currentUserId, markReelShared]);

  const filteredFollowing = followingUsers.filter((u) => {
    const name = `${u?.firstName || ''} ${u?.lastName || ''}`.trim();
    const username = u?.username || '';
    const q = shareQuery.trim().toLowerCase();
    if (!q) return true;
    return name.toLowerCase().includes(q) || username.toLowerCase().includes(q);
  });

  const toggleCaptionExpansion = useCallback((reelId) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  }, []);

  // ---- Render ----

  const renderReelItem = useCallback(
    ({ item, index }) => {
      const isActive = activeIndex === index;
      const isNearby = Math.abs(activeIndex - index) <= 1;
      const avatarUrl =
        getProfilePictureUrlByUserId(item.user?.id) ||
        resolveProfilePictureUrl(item.user?.userProfile);

      const isCaptionExpanded = !!expandedCaptions[item.id];

      return (
        <View
          style={[styles.videoContainer, { height: reelItemHeight, width: windowWidth }]}
          collapsable={false}
        >
          <ReelMediaClip
            item={item}
            isActive={isActive}
            isNearby={isNearby}
            isFocused={isFocused}
            width={windowWidth}
            height={reelItemHeight}
          />

          {/* Right side action buttons */}
          <View style={styles.actionsColumn}>
            <Pressable
              onPress={() => openUserProfile(navigation, item.user?.id)}
              style={styles.avatarBtn}
            >
              <View style={styles.avatar}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImg} resizeMode="cover" />
                ) : (
                  <View style={[styles.avatarInner, styles.avatarPlaceholder]}>
                    <User size={24} color="#fff" strokeWidth={2} />
                  </View>
                )}
              </View>
            </Pressable>
            <Pressable onPress={() => handleLike(item)} style={styles.actionBtn}>
              <Heart
                size={36}
                color={item.isLiked ? '#ff0050' : '#fff'}
                fill={item.isLiked ? '#ff0050' : 'transparent'}
                strokeWidth={2}
              />
              <Text style={styles.actionCount}>{item.likesCount ?? 0}</Text>
            </Pressable>
            <Pressable
              onPress={() => setCommentReel({ id: item.id, reel: item })}
              style={styles.actionBtn}
            >
              <MessageCircle size={32} color="#fff" strokeWidth={2} />
              <Text style={styles.actionCount}>{item.commentsCount ?? 0}</Text>
            </Pressable>
            <Pressable onPress={() => handleShare(item)} style={styles.actionBtn}>
              <Send size={30} color="#fff" strokeWidth={2} />
            </Pressable>
            {currentUserId &&
            String(item.user?.id ?? item.userId ?? '') === String(currentUserId) ? (
              <Pressable
                onPress={() => setMenuReelId((prev) => (prev === item.id ? null : item.id))}
                style={styles.actionBtn}
              >
                <MoreVertical size={28} color="#fff" strokeWidth={2} />
              </Pressable>
            ) : null}
          </View>

          {/* Tooltip menu */}
          {menuReelId === item.id && (
            <>
              <Pressable style={styles.tooltipBackdrop} onPress={() => setMenuReelId(null)} />
              <View style={styles.tooltipContainer}>
                <Pressable
                  style={styles.tooltipOption}
                  onPress={() => {
                    setMenuReelId(null);
                    handleDeleteReel(item);
                  }}
                >
                  <Trash2 size={18} color="#ff3b30" strokeWidth={2} />
                  <Text style={styles.tooltipOptionTextDanger}>Delete</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* Caption & user */}
          <View style={styles.captionOverlay}>
            <Text
              onPress={() => openUserProfile(navigation, item.user?.id)}
              style={styles.username}
            >
              @{item.user?.username || 'user'}
            </Text>
            {item.caption ? (
              <Pressable onPress={() => toggleCaptionExpansion(item.id)}>
                <Text style={styles.caption} numberOfLines={isCaptionExpanded ? undefined : 2}>
                  {item.caption}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      );
    },
    [
      activeIndex,
      isFocused,
      navigation,
      currentUserId,
      handleLike,
      handleShare,
      handleDeleteReel,
      setCommentReel,
      menuReelId,
      expandedCaptions,
      toggleCaptionExpansion,
      reelItemHeight,
      windowWidth,
    ],
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  if (loading && reels.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange || '#D48A4A'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {topOffset > 0 && <View style={[styles.topSpacer, { height: topOffset }]} />}
      <View style={styles.contentWrap}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.getParent()?.navigate('Home')}
            style={styles.addBtn}
            hitSlop={12}
          >
            <X size={28} color="#fff" strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle}>Clips</Text>
          <Pressable
            onPress={() => navigation.navigate('PostReel', { fromProfile: false })}
            style={styles.addBtn}
            hitSlop={12}
          >
            <Plus size={28} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>

        <FlatList
          ref={flatListRef}
          style={styles.list}
          data={reels}
          keyExtractor={keyExtractor}
          renderItem={renderReelItem}
          getItemLayout={getItemLayout}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          windowSize={5}
          removeClippedSubviews={false}
          pagingEnabled
          disableIntervalMomentum
          showsVerticalScrollIndicator={false}
          snapToInterval={reelItemHeight}
          snapToAlignment="start"
          decelerationRate="normal"
          onMomentumScrollBegin={handleMomentumScrollBegin}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.orange || '#D48A4A']}
              tintColor={colors.orange || '#D48A4A'}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : null
          }
        />

        <ReelCommentsOverlay
          visible={!!commentReel}
          onClose={() => setCommentReel(null)}
          reelId={commentReel?.id}
          reel={commentReel?.reel}
          onCommentAdded={(reelId, newCount) => {
            setReels((prev) =>
              prev.map((r) =>
                r.id === reelId ? { ...r, commentsCount: newCount } : r,
              ),
            );
          }}
          onCommentDeleted={(reelId, newCount) => {
            setReels((prev) =>
              prev.map((r) =>
                r.id === reelId ? { ...r, commentsCount: newCount } : r,
              ),
            );
          }}
        />

        <Modal
          visible={shareSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setShareSheetVisible(false)}
        >
          <View style={styles.shareModalWrap}>
            <Pressable style={styles.shareBackdrop} onPress={() => setShareSheetVisible(false)} />
            <View style={styles.shareSheet}>
              <View style={styles.shareHandle} />
              <Text style={styles.shareTitle}>Share</Text>
              <TextInput
                value={shareQuery}
                onChangeText={setShareQuery}
                placeholder="Search people"
                placeholderTextColor="#8e8e8e"
                style={styles.shareSearch}
              />

              {loadingFollowing ? (
                <View style={styles.shareLoading}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : (
                <FlatList
                  data={filteredFollowing}
                  keyExtractor={(item, index) => String(item?.id ?? item?.userId ?? index)}
                  contentContainerStyle={styles.shareListContent}
                  renderItem={({ item }) => {
                    const uid = item?.id ?? item?.userId;
                    const fullName =
                      `${item?.firstName || ''} ${item?.lastName || ''}`.trim() ||
                      item?.username ||
                      'User';
                    const avatarUrl = uid ? getProfilePictureUrlByUserId(uid) : null;
                    return (
                      <View style={styles.shareUserRow}>
                        <View style={styles.shareUserLeft}>
                          {avatarUrl ? (
                            <Image source={{uri: avatarUrl}} style={styles.shareAvatar} />
                          ) : (
                            <View style={[styles.shareAvatar, styles.shareAvatarFallback]}>
                              <User size={18} color="#fff" />
                            </View>
                          )}
                          <View>
                            <Text style={styles.shareName}>{fullName}</Text>
                            {item?.username ? (
                              <Text style={styles.shareUsername}>@{item.username}</Text>
                            ) : null}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.sendBtn}
                          disabled={sendingToUserId === uid}
                          onPress={() => handleSendToUser(item)}
                        >
                          {sendingToUserId === uid ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text style={styles.sendBtnText}>Send</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.shareEmptyText}>No people found.</Text>
                  }
                />
              )}

              <TouchableOpacity
                style={styles.moreOptionsBtn}
                onPress={handleMoreOptionsShare}
              >
                <Text style={styles.moreOptionsText}>More options</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topSpacer: { width: '100%', backgroundColor: 'transparent' },
  contentWrap: { flex: 1 },
  list: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  addBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  videoContainer: {
    backgroundColor: '#000',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  videoClip: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  videoPlaceholder: {
    backgroundColor: '#000',
  },
  actionsColumn: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  avatarBtn: { marginBottom: 8 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: { backgroundColor: '#555' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  actionBtn: { alignItems: 'center' },
  actionCount: { fontSize: 12, color: '#fff', marginTop: 4, fontWeight: '600' },
  captionOverlay: {
    position: 'absolute',
    left: 12,
    right: 70,
    bottom: 100,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  caption: { fontSize: 13, color: '#fff', opacity: 0.9 },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
  tooltipBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  tooltipContainer: {
    position: 'absolute',
    right: 52,
    bottom: 120,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    paddingVertical: 4,
    minWidth: 130,
    zIndex: 21,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  tooltipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  tooltipOptionTextDanger: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '600',
  },
  shareModalWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  shareBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  shareSheet: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '78%',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 20,
  },
  shareHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#555',
    marginBottom: 10,
  },
  shareTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  shareSearch: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#252525',
    color: '#fff',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  shareLoading: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  shareListContent: {
    paddingBottom: 10,
  },
  shareUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  shareUserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  shareAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#333',
  },
  shareAvatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareUsername: {
    color: '#b0b0b0',
    fontSize: 12,
    marginTop: 1,
  },
  sendBtn: {
    backgroundColor: '#3797EF',
    borderRadius: 8,
    minWidth: 68,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  shareEmptyText: {
    color: '#b0b0b0',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 18,
  },
  moreOptionsBtn: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
  },
  moreOptionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ReelsScreen;
