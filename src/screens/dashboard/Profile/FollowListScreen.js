import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { getFollowers, getFollowing } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import st from '../../../global/styles';

const COLORS = {
  orange: '#D48A4A',
  text: '#1B1B1B',
  sub: '#7A7A7A',
  line: '#E7E0DA',
  bg: '#FFFFFF',
};

/**
 * Screen showing either followers or following list for a user.
 * Route params: { userId, listType: 'followers' | 'following' }
 */
export default function FollowListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;
  const listType = route.params?.listType ?? 'followers'; // 'followers' | 'following'

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchList = useCallback(async () => {
    if (!userId) {
      setList([]);
      setLoading(false);
      return;
    }
    try {
      const res = listType === 'followers' ? await getFollowers(userId) : await getFollowing(userId);
      const raw = res?.data ?? res ?? [];
      const arr = Array.isArray(raw) ? raw : [];
      const mapped = arr.map((item) => ({
        id: String(item?.id ?? ''),
        userId: item?.id,
        username: item?.username ?? item?.userName ?? '',
        firstName: item?.firstName ?? '',
        lastName: item?.lastName ?? '',
      })).filter((u) => u.id);
      setList(mapped);
    } catch (e) {
      console.warn('Follow list load error', e);
      setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, listType]);

  useEffect(() => {
    setLoading(true);
    fetchList();
  }, [fetchList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchList();
  }, [fetchList]);

  const displayName = (item) => {
    const first = item.firstName || '';
    const last = item.lastName || '';
    return [first, last].filter(Boolean).join(' ') || item.username || 'User';
  };

  const placeholderAvatar = 'https://i.pravatar.cc/150?img=3';

  const getAvatarUri = (item) => {
    const url = getProfilePictureUrlByUserId(item?.userId);
    const resolved = resolveProfilePictureUrl(url || '');
    if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
      return resolved;
    }
    return placeholderAvatar;
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('Profiles', { userId: item.userId })}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
    >
      <Image
        source={{ uri: getAvatarUri(item) }}
        style={styles.avatar}
      />
      <View style={styles.textWrap}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName(item)}
        </Text>
        {item.username ? (
          <Text style={styles.username} numberOfLines={1}>
            @{item.username}
          </Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  if (loading && list.length === 0) {
    return (
      <View style={[st.flex, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  const title = listType === 'following' ? 'Following' : 'Followers';

  return (
    <View style={[st.flex, { backgroundColor: COLORS.bg }]}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <ChevronLeft size={24} color={COLORS.text} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.backBtn} />
        </View>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {listType === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </Text>
            </View>
          }
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  textWrap: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  username: {
    fontSize: 13,
    color: COLORS.sub,
    marginTop: 2,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    color: COLORS.sub,
    fontWeight: '300',
    marginLeft: 8,
  },
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.sub,
    fontWeight: '500',
  },
});
