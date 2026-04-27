import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserId } from '../../../redux/store/getState';
import { getFollowing, getChatThreads, createOrGetChatThread } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { colors } from '../../../global/theme';
import SearchInput from '../Main/SearchInput';

function AvatarOrIcon({ userId }) {
  const [avatarError, setAvatarError] = useState(false);
  const url = userId ? getProfilePictureUrlByUserId(userId) : null;
  const avatarUrl = url ? (resolveProfilePictureUrl(url) || url) : null;
  const showIcon = !avatarUrl || avatarError;

  useEffect(() => {
    setAvatarError(false);
  }, [userId]);

  if (showIcon) {
    return (
      <View style={[styles.avatar, styles.avatarPlaceholder]}>
        <User size={26} color="#fff" strokeWidth={2} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri: avatarUrl }}
      style={styles.avatar}
      resizeMode="cover"
      onError={() => setAvatarError(true)}
    />
  );
}

export default function ChatListScreen() {
  const navigation = useNavigation();
  const currentUserId = getUserId();
  const [threads, setThreads] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lastLoadRef = useRef(0);
  const hasMountedRef = useRef(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const loaderTimerRef = useRef(null);
  const FOCUS_REFRESH_THROTTLE_MS = 15000;
  const LOADER_DELAY_MS = 600; // Only show spinner if API takes >600ms (avoids flash for fast requests)

  const load = useCallback(async (showLoader = true) => {
    if (!currentUserId) return;
    if (showLoader) {
      setLoading(true);
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
      loaderTimerRef.current = setTimeout(() => setShowSpinner(true), LOADER_DELAY_MS);
    }
    try {
      const [threadsRes, followingRes] = await Promise.all([
        getChatThreads(currentUserId),
        getFollowing(currentUserId),
      ]);
      const threadList = Array.isArray(threadsRes?.data) ? threadsRes.data : [];
      const followList = Array.isArray(followingRes?.data) ? followingRes.data : [];
      setThreads(threadList);
      setFollowing(followList);
      lastLoadRef.current = Date.now();
    } catch (e) {
      console.warn('Chat list load error', e);
    } finally {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
      setShowSpinner(false);
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useEffect(() => () => {
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
  }, []);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }
      const now = Date.now();
      if (now - lastLoadRef.current < FOCUS_REFRESH_THROTTLE_MS) return;
      load(false);
    }, [load])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const openChatWithUser = useCallback(
    async (otherUser) => {
      const otherId = otherUser?.id ?? otherUser?.userId;
      if (!currentUserId || !otherId) return;
      try {
        const res = await createOrGetChatThread(currentUserId, otherId);
        const thread = res?.data;
        if (thread?.id) {
          navigation.navigate('ChatScreen', {
            threadId: thread.id,
            otherUserId: otherId,
            otherUsername: otherUser?.username || otherUser?.firstName || 'User',
            otherName: [otherUser?.firstName, otherUser?.lastName].filter(Boolean).join(' ') || otherUser?.username || 'User',
            otherUserHandle: otherUser?.username,
          });
        }
      } catch (e) {
        console.warn('Create thread error', e);
      }
    },
    [currentUserId, navigation]
  );

  const openThread = useCallback(
    (thread) => {
      const otherId = thread.otherUserId;
      navigation.navigate('ChatScreen', {
        threadId: thread.id,
        otherUserId: otherId,
        otherUsername: thread.otherUsername || 'User',
        otherName: thread.otherName || thread.otherUsername || 'User',
        otherUserHandle: thread.otherUserHandle || thread.otherUsername,
      });
    },
    [navigation]
  );

  const threadIds = new Set(threads.map((t) => t.otherUserId));

  const followingNotInThreads = following.filter((u) => {
    const id = u?.id ?? u?.userId;
    return id && !threadIds.has(id);
  });

  const getFollowingDisplayName = (item) =>
    item?.username || item?.firstName || [item?.firstName, item?.lastName].filter(Boolean).join(' ') || 'User';

  const query = (searchQuery || '').trim().toLowerCase();

  const filteredThreads = useMemo(() => {
    let list = query
      ? threads.filter((t) => (t.otherUsername || 'User').toLowerCase().includes(query))
      : [...threads];
    list.sort((a, b) => {
      const getTime = (t) =>
        new Date(t.lastMessageAtForSort || t.lastMessageAt || t.updatedAt || t.createdAt || 0).getTime();
      return getTime(b) - getTime(a);
    });
    return list;
  }, [threads, query]);

  const filteredFollowing = useMemo(() => {
    if (!query) return followingNotInThreads;
    return followingNotInThreads.filter((u) =>
      getFollowingDisplayName(u).toLowerCase().includes(query)
    );
  }, [followingNotInThreads, query]);

  const renderThread = ({ item }) => {
    const mostRecentContent = item.lastMessagePreview || 'No messages yet';
    const hasMessages = mostRecentContent !== 'No messages yet';
    const isFromMe = String(item.lastMessageSenderId) === String(currentUserId);
    /** Last message is from the other person — they are waiting on your reply. */
    const needsReply = hasMessages && !isFromMe;
    const previewText =
      mostRecentContent !== 'No messages yet' && isFromMe
        ? `You: ${mostRecentContent}`
        : mostRecentContent;
    return (
      <TouchableOpacity
        style={[styles.row, needsReply && styles.rowAwaitingReply]}
        onPress={() => openThread(item)}
        activeOpacity={0.7}
      >
        <AvatarOrIcon userId={item.otherUserId} />
        <View style={styles.rowText}>
          <Text style={[styles.name, needsReply && styles.nameAwaitingReply]} numberOfLines={1}>
            {item.otherUsername || 'User'}
          </Text>
          <Text style={[styles.preview, needsReply && styles.previewAwaitingReply]} numberOfLines={1}>
            {previewText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFollowing = ({ item }) => {
    const id = item?.id ?? item?.userId;
    const name = getFollowingDisplayName(item);
    return (
      <TouchableOpacity style={styles.row} onPress={() => openChatWithUser(item)} activeOpacity={0.7}>
        <AvatarOrIcon userId={id} />
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.preview}>Start conversation</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && threads.length === 0 && following.length === 0 && showSpinner) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.searchWrap}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
        />
      </View>
      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            {filteredThreads.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recent</Text>
                {filteredThreads.map((t) => (
                  <View key={t.id}>{renderThread({ item: t })}</View>
                ))}
              </>
            )}
            <Text style={styles.sectionTitle}>Message someone you follow</Text>
            {filteredFollowing.map((u) => (
              <View key={u?.id ?? u?.userId}>{renderFollowing({ item: u })}</View>
            ))}
          </>
        }
        keyExtractor={(_, i) => String(i)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.orange]} tintColor={colors.orange} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          following.length === 0 ? (
            <Text style={styles.empty}>Follow people to start messaging them.</Text>
          ) : query && filteredThreads.length === 0 && filteredFollowing.length === 0 ? (
            <Text style={styles.empty}>No users match "{searchQuery}"</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 4,
    backgroundColor: '#fff',
  },
  listContent: { paddingBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  rowAwaitingReply: {
    backgroundColor: 'rgba(253, 124, 32, 0.09)',
    borderLeftWidth: 4,
    borderLeftColor: colors.orange || '#fd7c20',
    paddingLeft: 12,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#eee' },
  avatarPlaceholder: { backgroundColor: colors.orange || '#D48A4A', justifyContent: 'center', alignItems: 'center' },
  rowText: { marginLeft: 14, flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: '#000' },
  nameAwaitingReply: {
    fontWeight: '700',
    color: '#111',
  },
  preview: { fontSize: 14, color: '#666', marginTop: 2 },
  previewAwaitingReply: {
    color: '#333',
    fontWeight: '500',
  },
  empty: { textAlign: 'center', color: '#666', marginTop: 24, paddingHorizontal: 24 },
});
