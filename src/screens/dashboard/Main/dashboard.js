import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import st from '../../../global/styles';
import { Menu, Bell, MessageCircle, Plus, User } from 'lucide-react-native';
import { APP_TEXT, colors } from '../../../global/theme';
import HeaderDashboard from '../../../components/dashboardHeader';
import PostCard from '../../../components/PostCard';
import SearchInput from './SearchInput';
import LinearGradient from 'react-native-linear-gradient';
import { getAllPosts, getStoriesFeed, getFollowing, deletePost, getNotificationsCount } from '../../../utils/apicalls/socialHandler';
import { getUserId } from '../../../redux/store/getState';
import { connectWebSocket } from '../../../utils/services/websocketService';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

/** Same avatar resolution as FollowListScreen: profile picture by userId, or null for no photo */
function getAvatarUriForUserId(userId) {
  const url = getProfilePictureUrlByUserId(userId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return null;
}

/** Group story feed by user for lookup */
function groupStoriesByUser(feedList) {
  const byUser = new Map();
  if (!Array.isArray(feedList)) return byUser;
  feedList.forEach(s => {
    const uid = s?.user?.id ?? s?.userId;
    if (!uid) return;
    if (!byUser.has(uid)) {
      byUser.set(uid, { user: s.user, stories: [] });
    }
    byUser.get(uid).stories.push(s);
  });
  return byUser;
}

/**
 * Build stories row: [add tile] + all following (profile pics; gradient border if they have a story).
 * Row items: { type: 'add', myStories }, { type: 'user', userId, user, stories (optional) }
 */
function buildStoriesRowData(followingList, storyFeed, currentUserId) {
  const following = Array.isArray(followingList) ? followingList : [];
  const storiesByUser = groupStoriesByUser(storyFeed);
  const currentStories = currentUserId ? (storiesByUser.get(currentUserId)?.stories ?? []) : [];

  const row = [{ type: 'add', myStories: currentStories }];
  following.forEach(user => {
    const uid = user?.id ?? user?.userId;
    if (!uid) return;
    const { stories = [] } = storiesByUser.get(uid) ?? {};
    row.push({ type: 'user', userId: uid, user, stories });
  });
  return row;
}

const MainDashboard = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [storyFeed, setStoryFeed] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const currentUserId = getUserId();

  const loadPosts = useCallback(async () => {
    try {
      const res = await getAllPosts(currentUserId);
      const raw = res?.data ?? [];

      const formatted = (Array.isArray(raw) ? raw : []).map(item => ({
        id: String(item.id),
        postId: item.id,
        authorUserId: item.user?.id ?? item.userId,
        userName: item.user?.username || item.user?.name || 'Unknown',
        location: item.user?.location || 'Unknown',
        image: item.photoUrl || null,
        videoUrl: item.videoUrl || null,
        thumbnailUrl: item.thumbnailUrl || null,
        likes: item.likesCount ?? item.likes ?? 0,
        comments: item.commentsCount ?? item.comments ?? 0,
        shares: item.sharesCount ?? item.shares ?? 0,
        avatar: resolveProfilePictureUrl(item.user?.userProfile ?? item.user?.profileImageUrl) || getProfilePictureUrlByUserId(item.user?.id) || 'https://i.pravatar.cc/150',
        contentText: item.contentText || '',
        createdAt: item.createdAt,
        isLiked: !!item.isLiked,
        isShared: !!item.isShared,
      }));

      setPosts(formatted);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setRefreshing(false);
    }
  }, [currentUserId]);

  const loadStoryFeed = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await getStoriesFeed(currentUserId);
      const raw = res?.data ?? [];
      setStoryFeed(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error('Error fetching story feed:', err);
    }
  }, [currentUserId]);

  const loadFollowing = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await getFollowing(currentUserId);
      const raw = res?.data ?? res ?? [];
      setFollowing(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error('Error fetching following:', err);
    }
  }, [currentUserId]);

  const loadNotificationCount = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await getNotificationsCount(currentUserId);
      const count = res?.data != null ? Number(res.data) : 0;
      setNotificationCount(count);
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
  }, [currentUserId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
    loadStoryFeed();
    loadFollowing();
    loadNotificationCount();
  }, [loadPosts, loadStoryFeed, loadFollowing, loadNotificationCount]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    loadStoryFeed();
    loadFollowing();
  }, [loadStoryFeed, loadFollowing]);

  useEffect(() => {
    loadNotificationCount();
  }, [loadNotificationCount]);

  useEffect(() => {
    if (!currentUserId) return;
    connectWebSocket(currentUserId, {
      onNotifications: (payload) => {
        if (payload?.count != null) setNotificationCount(payload.count);
        else setNotificationCount((c) => c + 1);
      },
    }).catch(() => {});
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
      loadStoryFeed();
      loadFollowing();
      loadNotificationCount();
    }, [loadPosts, loadStoryFeed, loadFollowing, loadNotificationCount])
  );

  // ✅ Filter posts by search text (username, location, content)
  const filteredPosts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter(p => {
      const haystack = [p.userName, p.location, p.contentText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [posts, searchText]);


  const storyRowData = useMemo(
    () => buildStoriesRowData(following, storyFeed, currentUserId),
    [following, storyFeed, currentUserId]
  );

  /** Flat list of all stories in row order (my stories first, then each user's stories) and start index per row for opening at correct position */
  const { allStoriesFlat, startIndexByRow } = useMemo(() => {
    const flat = [];
    const startByRow = [];
    storyRowData.forEach((item, rowIndex) => {
      startByRow[rowIndex] = flat.length;
      if (item.type === 'add' && item.myStories?.length) {
        flat.push(...item.myStories);
      } else if (item.type === 'user' && item.stories?.length) {
        flat.push(...item.stories);
      }
    });
    return { allStoriesFlat: flat, startIndexByRow: startByRow };
  }, [storyRowData]);

  const StoriesRow = () => (
    <FlatList
      data={storyRowData}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) =>
        item.type === 'add' ? 'add' : `user-${item.userId}-${index}`
      }
      contentContainerStyle={styles.storiesContainer}
      renderItem={({ item, index: rowIndex }) => {
        if (item.type === 'add') {
          const myStories = item.myStories ?? [];
          const canViewMyStory = myStories.length > 0;
          const myAvatar = getAvatarUriForUserId(currentUserId);
          return (
            <View style={styles.addTileWrap}>
              <Pressable
                style={styles.addTile}
                onPress={() => {
                  if (canViewMyStory) {
                    navigation.navigate('StoryViewScreen', {
                      stories: allStoriesFlat,
                      initialIndex: startIndexByRow[rowIndex] ?? 0,
                      currentUserId,
                    });
                  } else {
                    navigation.navigate('StoryUploadScreen');
                  }
                }}
              >
                {canViewMyStory ? (
                  <View style={styles.storyWithGradientWrap}>
                    <LinearGradient
                      colors={['#f97316', '#ea580c', '#c2410c']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.storyGradientBorderLayer}
                    />
                    <View style={[styles.storyImgInner, { zIndex: 1 }]}>
                      {myAvatar ? (
                        <Image
                          source={{ uri: myAvatar }}
                          style={styles.storyImgInGradient}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.storyImgInGradient, styles.storyIconWrap]}>
                          <User size={28} color={colors.grey || '#9ca3af'} strokeWidth={2} />
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.storyImgInnerFull}>
                    {myAvatar ? (
                      <Image
                        source={{ uri: myAvatar }}
                        style={styles.storyImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.storyImg, styles.storyIconWrap]}>
                        <User size={28} color={colors.grey || '#9ca3af'} strokeWidth={2} />
                      </View>
                    )}
                  </View>
                )}
              </Pressable>
              <Pressable
                style={styles.addPlus}
                onPress={() => navigation.navigate('StoryUploadScreen')}
              >
                <Plus size={18} color={colors.DARK_BLACK} />
              </Pressable>
            </View>
          );
        }

        if (item.type === 'user') {
          // Same API as FollowListScreen: avatar by userId only
          const profilePic = getAvatarUriForUserId(item.userId);
          const hasStory = (item.stories?.length ?? 0) > 0;
          const startIndex = startIndexByRow[rowIndex] ?? 0;

          const onPress = () => {
            if (hasStory) {
              navigation.navigate('StoryViewScreen', {
                stories: allStoriesFlat,
                initialIndex: startIndex,
                currentUserId,
              });
            } else {
              navigation.navigate('Profiles', { userId: item.userId });
            }
          };

          return (
            <Pressable style={styles.storyImgWrap} onPress={onPress}>
              {hasStory ? (
                <View style={styles.storyWithGradientWrap}>
                  <LinearGradient
                    colors={['#f97316', '#ea580c', '#c2410c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.storyGradientBorderLayer}
                  />
                  <View style={[styles.storyImgInner, { zIndex: 1 }]}>
                    {profilePic ? (
                      <Image
                        source={{ uri: profilePic }}
                        style={styles.storyImgInGradient}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.storyImgInGradient, styles.storyIconWrap]}>
                        <User size={28} color={colors.grey || '#9ca3af'} strokeWidth={2} />
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.storyImgInnerFull}>
                  {profilePic ? (
                    <Image
                      source={{ uri: profilePic }}
                      style={styles.storyImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.storyImg, styles.storyIconWrap]}>
                      <User size={28} color={colors.grey || '#9ca3af'} strokeWidth={2} />
                    </View>
                  )}
                </View>
              )}
            </Pressable>
          );
        }
        return null;
      }}
    />
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <HeaderDashboard
        title="JainSansaar"
        LeftIcon={Menu}
        RightIcon1={Bell}
        RightIcon2={MessageCircle}
        leftNav="HomeDrawer"
        rightNav1="Notifications"
        rightNav2="Chat"
        rightIcon1BadgeCount={notificationCount}
      />

      <View style={styles.content}>
        <View style={[st.pd_H20, st.mt_B10]}>
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={APP_TEXT.SEARCH}
            editable={false}
            onPress={() => navigation.navigate('SearchScreen')}
          />
        </View>
        <View style={[st.pd_H20, st.mt_B10]}>
          <StoriesRow />
        </View>
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          style={styles.postList}
          contentContainerStyle={[st.pdB20, { paddingBottom: 90, paddingHorizontal: 16 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.PRIMARY_BUTTON]}
              tintColor={colors.PRIMARY_BUTTON}
            />
          }
          renderItem={({ item }) => (
            <PostCard
              postId={item.postId}
              authorUserId={item.authorUserId}
              currentUserId={currentUserId}
              userName={item.userName}
              createdAt={item.createdAt}
              image={item.image}
              videoUrl={item.videoUrl}
              thumbnailUrl={item.thumbnailUrl}
              likes={item.likes}
              comments={item.comments}
              shares={item.shares}
              avatar={item.avatar}
              contentText={item.contentText}
              initialIsLiked={item.isLiked}
              initialIsShared={item.isShared}
              onAuthorPress={(authorUserId) =>
                navigation.navigate('Profiles', { userId: authorUserId })
              }
              onImagePress={() =>
                navigation.navigate('PostPreview', { postId: item.postId })
              }
              onLikeChange={(newLiked, newCount) => {
                setPosts(prev =>
                  prev.map(p =>
                    p.postId === item.postId ? { ...p, isLiked: newLiked, likes: newCount } : p
                  )
                );
              }}
              onDelete={() => {
                Alert.alert(
                  'Delete post',
                  'Are you sure you want to delete this post? The photo or video will be removed.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deletePost(item.postId, currentUserId);
                          setPosts(prev => prev.filter(p => p.postId !== item.postId));
                        } catch (e) {
                          Alert.alert('Error', e?.data?.message || e?.message || 'Failed to delete post');
                        }
                      },
                    },
                  ]
                );
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  postList: {
    flex: 1,
  },

  // ✅ Stories row styles
  storiesContainer: {
    paddingVertical: 14,
    gap: 12,
  },
  addTileWrap: {
    width: 74,
    height: 74,
    position: 'relative',
  },
  addTile: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  addTileImage: {
    width: 74,
    height: 74,
    borderRadius: 16,
  },
  addTilePlaceholder: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlus: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  storyImgWrap: {
    width: 74,
    height: 74,
  },
  storyWithGradientWrap: {
    width: 74,
    height: 74,
    position: 'relative',
  },
  storyGradientBorderLayer: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 18,
    left: 0,
    top: 0,
    zIndex: 0,
  },
  storyImgInner: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 68,
    height: 68,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  storyImgInnerFull: {
    width: 74,
    height: 74,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  storyImg: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  storyImgInGradient: {
    width: 68,
    height: 68,
    borderRadius: 15,
    backgroundColor: '#eee',
  },
  storyIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainDashboard;
