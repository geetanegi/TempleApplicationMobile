import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { getUserId } from '../../../redux/store/getState';
import { getProfileWithCounts, getProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { getUserPosts, follow, unfollow, isFollowing, createOrGetChatThread } from '../../../utils/apicalls/socialHandler';
import st from '../../../global/styles';

const { width } = Dimensions.get('window');
const GRID_PADDING_H = 16;
const CARD_GAP = 2;
const NUM_COLS = 3;
const CARD_W = (width - GRID_PADDING_H * 2 - CARD_GAP * (NUM_COLS - 1)) / NUM_COLS;
const CARD_H = CARD_W;

const COLORS = {
  orange: '#D48A4A',
  icon: '#B07C57',
  text: '#1B1B1B',
  sub: '#7A7A7A',
  line: '#E7E0DA',
  bg: '#FFFFFF',
};

const TABS = [
  { key: 'Photos', icon: 'image' },
  { key: 'Videos', icon: 'video' },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentUserId = getUserId();
  const paramUserId = route.params?.userId;
  const userId = paramUserId != null ? paramUserId : currentUserId;
  const isOwnProfile = currentUserId != null && String(userId) === String(currentUserId);

  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Photos');
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const isFollowingFetched = useRef(false);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const { profile: p, followersCount: fc, followingCount: fic } = await getProfileWithCounts(userId);
      console.log('p', p);
      setProfile(p);
      setFollowersCount(fc);
      setFollowingCount(fic);
    } catch (e) {
      console.warn('Profile load error', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadPosts = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getUserPosts(userId, currentUserId);
      const raw = res?.data ?? [];
      const list = Array.isArray(raw) ? raw.map(item => ({
        id: String(item.id),
        postId: item.id,
        photoUrl: item.photoUrl,
        videoUrl: item.videoUrl,
        contentText: item.contentText,
      })) : [];
      setPosts(list);
    } catch (e) {
      console.warn('User posts load error', e);
      setPosts([]);
    }
  }, [userId, currentUserId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadPosts()]);
    setRefreshing(false);
  }, [loadProfile, loadPosts]);

  useEffect(() => {
    setLoading(true);
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadProfile();
        loadPosts();
      }
    }, [userId, loadProfile, loadPosts]),
  );

  // Fetch is-following state when viewing another user's profile
  useEffect(() => {
    if (isOwnProfile || !currentUserId || !userId) return;
    if (isFollowingFetched.current) return;
    isFollowingFetched.current = true;
    isFollowing(currentUserId, userId)
      .then((res) => {
        const data = res?.data ?? res;
        setIsFollowingUser(!!data);
      })
      .catch(() => setIsFollowingUser(false));
  }, [currentUserId, userId, isOwnProfile]);

  // Reset follow fetch when switching to a different profile
  useEffect(() => {
    isFollowingFetched.current = false;
  }, [userId]);

  const handleFollow = useCallback(async () => {
    if (!currentUserId || !userId || isOwnProfile || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowingUser) {
        await unfollow(currentUserId, userId);
        setIsFollowingUser(false);
        setFollowersCount((c) => Math.max(0, c - 1));
      } else {
        await follow(currentUserId, userId);
        setIsFollowingUser(true);
        setFollowersCount((c) => c + 1);
      }
    } catch (e) {
      console.warn('Follow API error:', e);
    } finally {
      setFollowLoading(false);
    }
  }, [currentUserId, userId, isOwnProfile, isFollowingUser, followLoading]);

  const handleMessage = useCallback(async () => {
    if (!currentUserId || !userId || isOwnProfile || messageLoading) return;
    setMessageLoading(true);
    try {
      const res = await createOrGetChatThread(currentUserId, userId);
      const thread = res?.data;
      if (thread?.id) {
        const name = profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : (profile?.username || 'User');
        navigation.navigate('ChatScreen', {
          threadId: thread.id,
          otherUserId: userId,
          otherUsername: name,
        });
      }
    } catch (e) {
      console.warn('Create thread error', e);
    } finally {
      setMessageLoading(false);
    }
  }, [currentUserId, userId, isOwnProfile, messageLoading, navigation, profile?.username]);

  const displayName = useMemo(() => {
    if (!profile) return '';
    const first = profile.firstName || '';
    const last = profile.lastName || '';
    return [first, last].filter(Boolean).join(' ') || profile.username || 'User';
  }, [profile]);

  const avatarUrl = useMemo(() => getProfilePictureUrl(profile), [profile]);

  // Description: from user_profile.description (DB), then location, address. Backend: UserProfileDTO.description
  const about = useMemo(() => {
    const desc = profile?.userProfile?.description;
    const loc = profile?.userProfile?.location;
    const addr = profile?.userProfile?.address;
    return desc || loc || addr || '';
  }, [profile]);

  // Username: from user_master.username (DB). Backend: FetchProfileDTO.username
  const usernameDisplay = useMemo(() => {
    const u = profile?.username ?? profile?.userName;
    return typeof u === 'string' ? u.trim() : '';
  }, [profile]);

  const filteredByTab = useMemo(() => {
    if (activeTab === 'Videos') return posts.filter(p => p.videoUrl);
    return posts.filter(p => p.photoUrl); // Photos
  }, [posts, activeTab]);

  const renderHeader = () => (
    <View style={styles.headerWrap}>
      {/* Top bar: only when viewing others' profile (back button) */}
      {!isOwnProfile && (
        <View style={styles.topBar}>
          <Pressable hitSlop={12} onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </Pressable>
        </View>
      )}

      {/* Profile row: avatar + stats */}
      <View style={styles.profileRow}>
        <Image
          source={{ uri: avatarUrl || 'https://i.pravatar.cc/150?img=3' }}
          style={styles.avatar}
        />
        <View style={styles.profileRight}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <Pressable
              style={styles.statBox}
              onPress={() => navigation.navigate('FollowList', { userId, listType: 'followers' })}
            >
              <Text style={styles.statValue}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>
            <Pressable
              style={styles.statBox}
              onPress={() => navigation.navigate('FollowList', { userId, listType: 'following' })}
            >
              <Text style={styles.statValue}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.usernameRow}>
        <Text style={styles.username}>@{usernameDisplay || 'username'}</Text>
      </View>
      <View style={styles.aboutRow}>
        <View style={styles.aboutHeaderRow}>
          <Text style={styles.aboutLabel}>About</Text>
          {isOwnProfile && profile ? (
            <Pressable
              hitSlop={12}
              onPress={() => {
                const profilePayload = {
                  id: profile?.id,
                  username: profile?.username,
                  name: displayName,
                  firstName: profile?.firstName,
                  lastName: profile?.lastName,
                  email: profile?.email,
                  avatar: avatarUrl,
                  bio: about,
                  description: profile?.userProfile?.description ?? about,
                  location: profile?.userProfile?.location,
                  userProfile: profile?.userProfile,
                };
                navigation.navigate('EditProfileScreen', { profile: profilePayload });
              }}
              style={styles.editBtn}
            >
              <Feather name="edit-2" size={20} color={COLORS.orange} />
            </Pressable>
          ) : !isOwnProfile ? (
            <View style={styles.followMessageRow}>
              <Pressable
                onPress={handleFollow}
                disabled={followLoading}
                style={[
                  styles.followBtn,
                  { backgroundColor: isFollowingUser ? '#888' : COLORS.orange },
                ]}
              >
                {followLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.followBtnText}>{isFollowingUser ? 'Following' : 'Follow'}</Text>
                )}
              </Pressable>
              <Pressable
                onPress={handleMessage}
                disabled={messageLoading}
                style={styles.messageBtn}
              >
                {messageLoading ? (
                  <ActivityIndicator size="small" color={COLORS.orange} />
                ) : (
                  <MaterialCommunityIcons name="message-outline" size={22} color={COLORS.orange} />
                )}
              </Pressable>
            </View>
          ) : null}
        </View>
        <Text style={styles.bio}>{about || 'No description yet.'}</Text>
      </View>

      {/* Create new post - only for own profile */}
      {isOwnProfile && (
        <TouchableOpacity
          style={styles.createPostRow}
          onPress={() => navigation.navigate('CreatePost')}
          activeOpacity={0.8}
        >
          <View style={styles.createPostIconWrap}>
            <Feather name="plus" size={22} color="#fff" />
          </View>
          <Text style={styles.createPostText}>Create new post</Text>
        </TouchableOpacity>
      )}

      {/* Tabs - 2 only: Photos, Videos */}
      <View style={styles.tabRow}>
        {TABS.map(t => {
          const isActive = activeTab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              style={styles.tabBtn}
            >
              <View style={styles.tabIconContainer}>
                <MaterialCommunityIcons
                  name={t.icon}
                  size={26}
                  color={isActive ? COLORS.orange : '#5A5A5A'}
                />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {t.key}
              </Text>
              {isActive ? (
                <View style={styles.tabUnderline} />
              ) : (
                <View style={styles.tabUnderlineOff} />
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.divider} />
    </View>
  );

  const renderItem = ({ item, index }) => {
    const mediaUri = item.photoUrl || item.videoUrl;
    const isEndOfRow = (index + 1) % NUM_COLS === 0;
    return (
      <Pressable
        style={[
          styles.card,
          !isEndOfRow && styles.cardMarginRight,
        ]}
        onPress={() => navigation.navigate('PostPreview', { postId: item.postId })}
      >
        {mediaUri ? (
          <Image source={{ uri: mediaUri }} style={styles.cardImg} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImg, styles.cardPlaceholder]}>
            <Text style={styles.placeholderText} numberOfLines={2}>
              {item.contentText || 'Post'}
            </Text>
          </View>
        )}
        {item.videoUrl ? (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={20} color="#fff" />
          </View>
        ) : null}
      </Pressable>
    );
  };

  if (loading && !profile) {
    return (
      <View style={[st.flex, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  return (
    <View style={[st.flex, { backgroundColor: COLORS.bg }]}>
      <SafeAreaView style={styles.container} edges={[]}>
        <FlatList
          data={filteredByTab}
          key={activeTab}
          keyExtractor={(it, idx) => it?.id ?? String(idx)}
          numColumns={NUM_COLS}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.orange]}
              tintColor={COLORS.orange}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  centered: { justifyContent: 'center', alignItems: 'center' },
  listContent: {
    paddingHorizontal: GRID_PADDING_H,
    paddingBottom: 24,
  },
  headerWrap: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followBtn: {
    minWidth: 96,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  followMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  messageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#eee',
  },
  profileRight: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 2,
    fontWeight: '600',
  },
  usernameRow: {
    marginTop: 12,
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  aboutRow: {
    marginTop: 10,
  },
  aboutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  aboutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sub,
  },
  bio: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1B1B1B',
    fontWeight: '500',
  },
  createPostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  createPostIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  createPostText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tabBtn: {
    alignItems: 'center',
    flex: 1,
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5A5A',
  },
  tabLabelActive: {
    color: COLORS.orange,
    fontWeight: '700',
  },
  tabUnderline: {
    marginTop: 8,
    height: 3,
    width: 44,
    borderRadius: 3,
    backgroundColor: COLORS.orange,
    alignSelf: 'center',
  },
  tabUnderlineOff: {
    marginTop: 8,
    height: 3,
    width: 44,
    borderRadius: 3,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  divider: {
    marginTop: 10,
    height: 1,
    backgroundColor: COLORS.line,
  },
  columnWrap: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  cardMarginRight: {
    marginRight: CARD_GAP,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cardPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  placeholderText: {
    fontSize: 11,
    color: COLORS.sub,
    textAlign: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
