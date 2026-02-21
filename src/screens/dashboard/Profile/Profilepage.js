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
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { ChevronLeft, User, Menu } from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { getUserId } from '../../../redux/store/getState';
import { getProfileWithCounts, getProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { getUserPosts, follow, unfollow, isFollowing, createOrGetChatThread } from '../../../utils/apicalls/socialHandler';
import { getUserReels } from '../../../utils/apicalls/reelHandler';
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
  { key: 'Reels', icon: 'film' },
];

const ProfileGridCard = React.memo(({ item, index, activeTab, onPressReel, onPressPost }) => {
  const isReel = activeTab === 'Reels';
  const mediaUri = isReel || item.videoUrl
    ? (item.thumbnailUrl || item.videoUrl || item.photoUrl)
    : (item.photoUrl || item.videoUrl);
  const isEndOfRow = (index + 1) % NUM_COLS === 0;
  const source = useMemo(() => (mediaUri ? { uri: mediaUri } : null), [mediaUri]);
  return (
    <Pressable
      style={[styles.card, !isEndOfRow && styles.cardMarginRight]}
      onPress={() => (isReel ? onPressReel() : onPressPost())}
    >
      {mediaUri ? (
        <Image source={source} style={styles.cardImg} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImg, styles.cardPlaceholder]}>
          <Text style={styles.placeholderText} numberOfLines={2}>
            {item.contentText || item.caption || 'Post'}
          </Text>
        </View>
      )}
      {(item.videoUrl || isReel) ? (
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={20} color="#fff" />
        </View>
      ) : null}
    </Pressable>
  );
});

/** URL regex - matches http(s) URLs */
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/** Renders bio text with clickable links and preserved line breaks */
function BioWithLinks({ text, style }) {
  if (!text || !text.trim()) return <Text style={style}>No description yet.</Text>;
  const parts = text.split(URL_REGEX);
  return (
    <Text style={style}>
      {parts.map((part, i) => {
        const isUrl = part.startsWith('http://') || part.startsWith('https://');
        if (isUrl) {
          const url = part.replace(/[.,;:!?)\]]+$/, '');
          return (
            <Text
              key={i}
              style={[style, { color: COLORS.orange, textDecorationLine: 'underline' }]}
              onPress={() => Linking.openURL(url).catch(() => {})}
            >
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const currentUserId = getUserId();
  const paramUserId = route.params?.userId;
  const userId = paramUserId != null ? paramUserId : currentUserId;
  const isOwnProfile = currentUserId != null && String(userId) === String(currentUserId);
  const fromFollowList = route.params?.fromFollowList === true;

  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Photos');
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const isFollowingFetched = useRef(false);
  const lastFetchedAt = useRef(0);
  const FOCUS_REFRESH_THROTTLE_MS = 20000; // Only refetch on focus if 20+ sec since last fetch

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const { profile: p, followersCount: fc, followingCount: fic } = await getProfileWithCounts(userId);
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
      const list = Array.isArray(raw)
        ? raw
            .map(item => ({
              id: String(item.id),
              postId: item.id,
              photoUrl: item.photoUrl,
              videoUrl: item.videoUrl,
              thumbnailUrl: item.thumbnailUrl,
              contentText: item.contentText,
              createdAt: item.createdAt ?? item.createdDate,
            }))
            .sort((a, b) => {
              const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return tb - ta;
            })
        : [];
      setPosts(list);
    } catch (e) {
      console.warn('User posts load error', e);
      setPosts([]);
    }
  }, [userId, currentUserId]);

  const loadReels = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getUserReels(userId, currentUserId);
      const raw = res?.data ?? [];
      const list = Array.isArray(raw)
        ? raw
            .map(item => ({
              id: String(item.id),
              reelId: item.id,
              videoUrl: item.videoUrl,
              thumbnailUrl: item.thumbnailUrl,
              caption: item.caption,
              createdAt: item.createdAt ?? item.createdDate,
            }))
            .sort((a, b) => {
              const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return tb - ta;
            })
        : [];
      setReels(list);
    } catch (e) {
      console.warn('User reels load error', e);
      setReels([]);
    }
  }, [userId, currentUserId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    lastFetchedAt.current = Date.now();
    await Promise.all([loadProfile(), loadPosts(), loadReels()]);
    setRefreshing(false);
  }, [loadProfile, loadPosts, loadReels]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      const isInitialLoad = !profile && !loading;
      const shouldRefresh =
        isInitialLoad ||
        route.params?.refreshProfile === true ||
        (Date.now() - lastFetchedAt.current) > FOCUS_REFRESH_THROTTLE_MS;

      if (shouldRefresh) {
        lastFetchedAt.current = Date.now();
        if (route.params?.refreshProfile) {
          navigation.setParams?.({ refreshProfile: undefined });
        }
        if (isInitialLoad) setLoading(true);
        Promise.all([loadProfile(), loadPosts(), loadReels()]).finally(() => {
          if (isInitialLoad) setLoading(false);
        });
      }
    }, [userId, profile, loading, loadProfile, loadPosts, loadReels, route.params?.refreshProfile, navigation]),
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
    if (activeTab === 'Reels') return reels;
    return posts.filter(p => p.photoUrl); // Photos
  }, [posts, reels, activeTab]);

  const renderHeader = () => (
    <View style={[styles.headerWrap, !isOwnProfile && styles.headerWrapCompact]}>
      {/* Profile: avatar on top, name + username below */}
      <View style={styles.profileSection}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarIconWrap]}>
            <User size={36} color={COLORS.sub} strokeWidth={2} />
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.username} numberOfLines={1}>
          @{usernameDisplay || 'username'}
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
        <BioWithLinks text={about} style={styles.bio} />
      </View>

      {/* Temple section - for temple users */}
      {profile?.isTempleMember && (
        <View style={styles.templeSection}>
          {profile?.temple?.latitude != null && profile?.temple?.longitude != null ? (
            <>
              <View style={styles.templeInfoRow}>
                <View style={styles.templeInfo}>
                  <Text style={styles.templeLabel}>My Temple</Text>
                  <Text style={styles.templeName} numberOfLines={2}>
                    {profile?.temple?.name || 'Temple'}
                  </Text>
                  {(profile?.temple?.location || profile?.temple?.address) ? (
                    <Text style={styles.templeAddress} numberOfLines={2}>
                      {profile?.temple?.location || profile?.temple?.address}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  style={styles.viewOnMapBtn}
                  onPress={() => {
                    navigation.getParent()?.navigate('Temples', {
                      screen: 'TempleList',
                      params: {
                        focusTemple: {
                          id: profile.temple.id,
                          name: profile.temple.name,
                          location: profile.temple.location,
                          latitude: profile.temple.latitude,
                          longitude: profile.temple.longitude,
                        },
                      },
                    });
                  }}
                >
                  <MaterialCommunityIcons name="map-marker-radius" size={24} color={COLORS.orange} />
                  <Text style={styles.viewOnMapText}>View on map</Text>
                </Pressable>
              </View>
              {isOwnProfile && (
                <TouchableOpacity
                  style={styles.updateTempleRow}
                  onPress={() => navigation.navigate('LocateTempleScreen', {
                    templeName: profile?.temple?.name,
                    location: profile?.temple?.location,
                  })}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="pencil" size={18} color={COLORS.orange} />
                  <Text style={styles.updateTempleText}>Update temple location</Text>
                </TouchableOpacity>
              )}
            </>
          ) : isOwnProfile ? (
            <TouchableOpacity
              style={styles.locateTempleRow}
              onPress={() => navigation.navigate('LocateTempleScreen', {
                templeName: profile?.temple?.name,
                location: profile?.temple?.location,
              })}
              activeOpacity={0.8}
            >
              <View style={styles.locateTempleIconWrap}>
                <MaterialCommunityIcons name="map-marker" size={22} color="#fff" />
              </View>
              <Text style={styles.locateTempleText}>Locate your temple</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Create new post - only for own profile */}
      {isOwnProfile && (
        <TouchableOpacity
          style={styles.createPostRow}
          onPress={() => navigation.navigate('CreateContentChoice')}
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

  const renderItem = useCallback(
    ({ item, index }) => (
      <ProfileGridCard
        item={item}
        index={index}
        activeTab={activeTab}
        onPressReel={() =>
          navigation.getParent()?.navigate('Video', {
            screen: 'ReelsFeed',
            params: { reelId: item.reelId ?? item.id },
          })
        }
        onPressPost={() => navigation.navigate('PostPreview', { postId: item.postId })}
      />
    ),
    [activeTab, navigation],
  );

  if (loading && !profile) {
    return (
      <View style={[st.flex, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  return (
    <View style={[st.flex, { backgroundColor: COLORS.bg }]}>
      <SafeAreaView
        style={styles.container}
        edges={isOwnProfile ? [] : ['bottom']}
      >
        {isOwnProfile ? (
          <View
            style={[
              styles.fixedHeaderRowCompact,
              { paddingTop: 8 + (insets.top || 0) },
            ]}
          >
            <Pressable
              hitSlop={12}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={styles.backBtn}
            >
              <Menu size={24} color={COLORS.text} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Profile
            </Text>
            <View style={styles.backBtn} />
          </View>
        ) : (
          <View
            style={[
              styles.fixedHeaderRowCompact,
              !fromFollowList && { paddingTop: 8 + (insets.top || 0) },
            ]}
          >
            <Pressable
              hitSlop={12}
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <ChevronLeft size={24} color={COLORS.text} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Profile
            </Text>
            <View style={styles.backBtn} />
          </View>
        )}
        <FlatList
          data={filteredByTab}
          key={activeTab}
          keyExtractor={(it, idx) => it?.id ?? String(idx)}
          numColumns={NUM_COLS}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyTabWrap}>
              <Text style={styles.emptyTabText}>
                No {activeTab.toLowerCase()} yet
              </Text>
            </View>
          }
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
          initialNumToRender={12}
          maxToRenderPerBatch={9}
          windowSize={5}
          removeClippedSubviews={true}
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
    paddingBottom: 100,
  },
  emptyTabWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyTabText: {
    fontSize: 15,
    color: COLORS.sub,
    fontWeight: '500',
  },
  headerWrap: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  headerWrapCompact: {
    paddingTop: 0,
    paddingBottom: 6,
  },
  fixedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  fixedHeaderRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingTop: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginHorizontal: 8,
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
  profileSection: {
    alignItems: 'center',
    marginTop: 0,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#eee',
  },
  avatarIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    paddingHorizontal: 24,
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
  username: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.sub,
    marginBottom: 12,
    textAlign: 'center',
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
  templeSection: {
    marginTop: 14,
  },
  templeInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  templeInfo: {
    flex: 1,
    marginRight: 12,
  },
  templeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.sub,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  templeName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  templeAddress: {
    fontSize: 13,
    color: COLORS.sub,
    marginTop: 4,
  },
  viewOnMapBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  viewOnMapText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.orange,
    marginTop: 4,
  },
  updateTempleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  updateTempleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.orange,
  },
  locateTempleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  locateTempleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locateTempleText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
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
