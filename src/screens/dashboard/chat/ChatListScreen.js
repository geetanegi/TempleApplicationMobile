import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getUserId } from '../../../redux/store/getState';
import { getFollowing, getChatThreads, createOrGetChatThread } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { colors } from '../../../global/theme';
import SearchInput from '../Main/SearchInput';

function getAvatarUri(userId) {
  const url = getProfilePictureUrlByUserId(userId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return 'https://i.pravatar.cc/150?img=3';
}

export default function ChatListScreen() {
  const navigation = useNavigation();
  const currentUserId = getUserId();
  const [threads, setThreads] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const [threadsRes, followingRes] = await Promise.all([
        getChatThreads(currentUserId),
        getFollowing(currentUserId),
      ]);
      const threadList = Array.isArray(threadsRes?.data) ? threadsRes.data : [];
      const followList = Array.isArray(followingRes?.data) ? followingRes.data : [];
      setThreads(threadList);
      setFollowing(followList);
    } catch (e) {
      console.warn('Chat list load error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

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
    if (!query) return threads;
    return threads.filter(
      (t) =>
        (t.otherUsername || 'User').toLowerCase().includes(query)
    );
  }, [threads, query]);

  const filteredFollowing = useMemo(() => {
    if (!query) return followingNotInThreads;
    return followingNotInThreads.filter((u) =>
      getFollowingDisplayName(u).toLowerCase().includes(query)
    );
  }, [followingNotInThreads, query]);

  const renderThread = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => openThread(item)} activeOpacity={0.7}>
      <Image source={{ uri: getAvatarUri(item.otherUserId) }} style={styles.avatar} />
      <View style={styles.rowText}>
        <Text style={styles.name} numberOfLines={1}>
          {item.otherUsername || 'User'}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.lastMessagePreview || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFollowing = ({ item }) => {
    const id = item?.id ?? item?.userId;
    const name = getFollowingDisplayName(item);
    return (
      <TouchableOpacity style={styles.row} onPress={() => openChatWithUser(item)} activeOpacity={0.7}>
        <Image source={{ uri: getAvatarUri(id) }} style={styles.avatar} />
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.preview}>Start conversation</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && threads.length === 0 && following.length === 0) {
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
          placeholder="Search users..."
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
    paddingTop: 8,
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
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#eee' },
  rowText: { marginLeft: 14, flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: '#000' },
  preview: { fontSize: 14, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', color: '#666', marginTop: 24, paddingHorizontal: 24 },
});
