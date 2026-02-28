import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';
import { Plus, Heart, MessageCircle, Send, User, X, MoreVertical } from 'lucide-react-native';
import ReelCommentsOverlay from './ReelCommentsOverlay';
import Share from 'react-native-share';
import { getUserId } from '../../../redux/store/getState';
import {
  getRandomReels,
  getReelById,
  likeReel,
  unlikeReel,
  shareReel,
  unshareReel,
  deleteReel,
} from '../../../utils/apicalls/reelHandler';
import {
  getProfilePictureUrlByUserId,
  resolveProfilePictureUrl,
} from '../../../utils/apicalls/profileHandler';
import { colors } from '../../../global/theme';

const { height, width } = Dimensions.get('window');
const PAGE_SIZE = 3;
const SCROLL_TOP_THRESHOLD = 80;
// Fixed offset to clear status/notification bar; ensures + button is clickable
const STATUS_BAR_OFFSET = Platform.OS === 'android' ? 56 : 0;

const ReelsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const initialReelId = route.params?.reelId;
  const topOffset = STATUS_BAR_OFFSET;
  const videoHeight = height - topOffset;
  const currentUserId = getUserId();
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [commentReel, setCommentReel] = useState(null);
  const flatListRef = useRef(null);
  const initialLoadDoneRef = useRef(false);
  const lastLoadedReelIdRef = useRef(null);
  const loadingPrevRef = useRef(false);
  const prependCountRef = useRef(0);

  const loadReels = useCallback(
    async (pageNum = 0, append = false, prepend = false) => {
      if (pageNum === 0 && !append) setLoading(true);
      else if (prepend) setLoadingPrev(true);
      else setLoadingMore(true);
      try {
        const res = await getRandomReels(pageNum, PAGE_SIZE, currentUserId);
        const data = res?.data ?? [];
        const list = Array.isArray(data) ? data : [];
        if (prepend && list.length > 0) {
          setReels((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newItems = list.filter((r) => !ids.has(r.id));
            prependCountRef.current = newItems.length;
            return [...newItems, ...prev];
          });
          setPage((p) => Math.max(0, p - 1));
          setHasPrev(pageNum > 0);
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: prependCountRef.current * videoHeight,
              animated: false,
            });
          }, 50);
        } else if (append) {
          setReels((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newItems = list.filter((r) => !ids.has(r.id));
            return [...prev, ...newItems];
          });
          setPage(pageNum);
        } else {
          setReels(list);
        }
        setHasMore(list.length >= PAGE_SIZE);
        if (!prepend) setHasPrev(pageNum > 0);
        if (!append && !prepend) setHasPrev(false); // initial load: no prev page
      } catch (err) {
        console.warn('Reels load error:', err);
        setHasMore(false);
        if (prepend) setHasPrev(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setLoadingPrev(false);
        if (prepend) loadingPrevRef.current = false;
      }
    },
    [currentUserId, videoHeight]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    loadReels(0, false).finally(() => setRefreshing(false));
  }, [loadReels]);

  const onEndReached = useCallback(() => {
    if (loadingMore || !hasMore) return;
    loadReels(page + 1, true, false);
  }, [page, loadReels, loadingMore, hasMore]);

  const onScroll = useCallback(
    (e) => {
      const y = e.nativeEvent.contentOffset.y;
      if (
        y <= SCROLL_TOP_THRESHOLD &&
        hasPrev &&
        !loadingPrevRef.current &&
        !loading &&
        page > 0
      ) {
        loadingPrevRef.current = true;
        const prevPage = page - 1;
        loadReels(prevPage, false, true).finally(() => {
          loadingPrevRef.current = false;
        });
      }
    },
    [hasPrev, loading, page, loadReels]
  );

  // Load specific reel when navigated with reelId param (e.g. from Profile)
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
      getRandomReels(0, PAGE_SIZE, currentUserId),
    ])
      .then(([reelRes, feedRes]) => {
        if (cancelled) return;
        const reelData = reelRes?.data;
        const feedList = Array.isArray(feedRes?.data) ? feedRes.data : [];
        const inFeed = feedList.some((r) => String(r.id) === reelIdStr);
        const list = inFeed
          ? feedList
          : reelData
            ? [{ ...reelData, id: reelData.id }, ...feedList]
            : feedList;
        setReels(list);
        setHasMore(feedList.length >= PAGE_SIZE);
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

  // First load (no reelId) - run once when component mounts/focuses and no reel requested
  useFocusEffect(
    useCallback(() => {
      if (initialReelId || initialLoadDoneRef.current) return;
      initialLoadDoneRef.current = true;
      loadReels(0, false);
    }, [loadReels, initialReelId])
  );

  // Scroll to the reel when we have initialReelId and reels are loaded
  useEffect(() => {
    if (!initialReelId || reels.length === 0) return;
    const index = reels.findIndex((r) => String(r.id) === String(initialReelId));
    if (index < 0) return;
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: index * videoHeight,
        animated: false,
      });
      setActiveIndex(index);
      navigation.setParams({ reelId: undefined });
      lastLoadedReelIdRef.current = null; // Reset so next navigation with reelId will load again
    }, 200);
    return () => clearTimeout(timer);
  }, [initialReelId, reels, navigation, videoHeight]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 150,
  }).current;

  const getItemLayout = useCallback(
    (_, index) => ({
      length: videoHeight,
      offset: videoHeight * index,
      index,
    }),
    [videoHeight]
  );

  const handleLike = useCallback(
    async (reel) => {
      if (!currentUserId) return;
      const isLiked = !!reel.isLiked;
      const newCount = (reel.likesCount ?? 0) + (isLiked ? -1 : 1);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id
            ? { ...r, isLiked: !isLiked, likesCount: newCount }
            : r
        )
      );
      try {
        if (isLiked) await unlikeReel(reel.id, currentUserId);
        else await likeReel(reel.id, currentUserId);
      } catch (e) {
        setReels((prev) =>
          prev.map((r) =>
            r.id === reel.id ? { ...r, isLiked, likesCount: reel.likesCount } : r
          )
        );
      }
    },
    [currentUserId]
  );

  const handleDeleteReel = useCallback(
    async (reel) => {
      const isOwn = currentUserId && String(reel.user?.id ?? reel.userId) === String(currentUserId);
      if (!isOwn) return;
      Alert.alert(
        'Delete Reel',
        'Are you sure you want to delete this reel?',
        [
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
                  e?.response?.data?.message || e?.message || 'Failed to delete reel'
                );
              }
            },
          },
        ]
      );
    },
    [currentUserId]
  );

  const handleShare = useCallback(
    async (reel) => {
      if (!currentUserId) return;
      const isShared = !!reel.isShared;
      const newCount = (reel.sharesCount ?? 0) + (isShared ? -1 : 1);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id ? { ...r, isShared: !isShared, sharesCount: newCount } : r
        )
      );
      try {
        if (isShared) {
          await unshareReel(reel.id, currentUserId);
        } else {
          await shareReel(reel.id, currentUserId);
          await Share.open({
            message: `Check out this reel! ${reel.caption || ''}`,
            url: reel.videoUrl,
            title: 'Share Reel',
          });
        }
      } catch (e) {
        if (e?.message !== 'User did not share') {
          setReels((prev) =>
            prev.map((r) =>
              r.id === reel.id ? { ...r, isShared: reel.isShared, sharesCount: reel.sharesCount } : r
            )
          );
        }
      }
    },
    [currentUserId]
  );

  const renderReelItem = useCallback(
    ({ item, index }) => {
      const isActive = activeIndex === index;
      const avatarUrl =
        getProfilePictureUrlByUserId(item.user?.id) ||
        resolveProfilePictureUrl(item.user?.userProfile);

      return (
        <View style={[styles.videoContainer, { height: videoHeight }]} collapsable={false}>
          {isFocused ? (
            <Video
              source={{ uri: item.videoUrl }}
              poster={item.thumbnailUrl || undefined}
              posterResizeMode="cover"
              style={styles.video}
              resizeMode="cover"
              repeat
              paused={!isActive}
              controls={false}
              controlsStyles={{
                hideSeekBar: true,
                hideDuration: true,
                hidePosition: true,
                hidePlayPause: true,
                hideForward: true,
                hideRewind: true,
                hideNext: true,
                hidePrevious: true,
                hideFullscreen: true,
                hideSettingButton: true,
              }}
              bufferConfig={{
                minBufferMs: 5000,
                maxBufferMs: 15000,
                bufferForPlaybackMs: 1500,
                bufferForPlaybackAfterRebufferMs: 2500,
              }}
            />
          ) : item.thumbnailUrl ? (
            <Image source={{ uri: item.thumbnailUrl }} style={styles.video} resizeMode="cover" />
          ) : (
            <View style={[styles.video, styles.videoPlaceholder]} />
          )}
          {/* Right side action buttons */}
          <View style={styles.actionsColumn}>
            <Pressable
              onPress={() => navigation.navigate('Profiles', { userId: item.user?.id })}
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
              <Text style={styles.actionCount}>{item.sharesCount ?? 0}</Text>
            </Pressable>
            {currentUserId && String(item.user?.id ?? item.userId ?? '') === String(currentUserId) ? (
              <Pressable
                onPress={() => handleDeleteReel(item)}
                style={styles.actionBtn}
              >
                <MoreVertical size={28} color="#fff" strokeWidth={2} />
              </Pressable>
            ) : null}
          </View>
          {/* Caption & user */}
          <View style={styles.captionOverlay}>
            <Text
              onPress={() => navigation.navigate('Profiles', { userId: item.user?.id })}
              style={styles.username}
            >
              @{item.user?.username || 'user'}
            </Text>
            {item.caption ? (
              <Text style={styles.caption} numberOfLines={2}>
                {item.caption}
              </Text>
            ) : null}
          </View>
        </View>
      );
    },
    [activeIndex, isFocused, navigation, currentUserId, handleLike, handleShare, handleDeleteReel, setCommentReel]
  );

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
      {/* Spacer to push content below status/notification bar */}
      {topOffset > 0 && <View style={[styles.topSpacer, { height: topOffset }]} />}
      <View style={styles.contentWrap}>
        {/* Header: X (left) -> Reels (center) -> + (right) */}
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
          data={reels}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderReelItem}
          getItemLayout={getItemLayout}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={true}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={videoHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={onScroll}
          scrollEventThrottle={200}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
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
                r.id === reelId ? { ...r, commentsCount: newCount } : r
              )
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topSpacer: { width: '100%', backgroundColor: 'transparent' },
  contentWrap: { flex: 1 },
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
    height,
    width,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
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
});

export default ReelsScreen;
