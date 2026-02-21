import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SectionList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../../../global/theme';
import { getUserId } from '../../../redux/store/getState';
import { getNotifications, markNotificationsSeen } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

function capitalizeName(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

function getAvatarUri(actorUserId) {
  if (!actorUserId) return 'https://i.pravatar.cc/150?img=3';
  const url = getProfilePictureUrlByUserId(actorUserId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return 'https://i.pravatar.cc/150?img=3';
}

const TYPE_FOLLOW = 'FOLLOW';
const TYPE_MESSAGE = 'MESSAGE';
const TYPE_LIKE = 'LIKE';
const TYPE_COMMENT = 'COMMENT';

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_7_DAYS = 7 * MS_PER_DAY;

function getNotificationSections(list) {
  const now = Date.now();
  const oneHourAgo = now - MS_PER_HOUR;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();
  const sevenDaysAgo = now - MS_7_DAYS;

  const recent = [];
  const today = [];
  const last7Days = [];

  for (const item of list) {
    const createdAt = item?.createdDate ?? item?.createdAt;
    const ts = createdAt ? new Date(createdAt).getTime() : 0;
    if (isNaN(ts) || ts < sevenDaysAgo) continue;

    if (ts >= oneHourAgo) {
      recent.push(item);
    } else if (ts >= startOfTodayMs) {
      today.push(item);
    } else {
      last7Days.push(item);
    }
  }

  const sections = [];
  if (recent.length > 0) sections.push({ title: 'Recent', data: recent });
  if (today.length > 0) sections.push({ title: 'Today', data: today });
  if (last7Days.length > 0) sections.push({ title: 'Last 7 days', data: last7Days });
  return sections;
}

function formatDateTime(createdAt) {
  if (createdAt == null) return '';
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

const NotificationItem = ({ item, image, message, actorName, notificationType, createdAt, isRead, onPress }) => {
  const type = (notificationType || '').toUpperCase();
  const rawName = (actorName || '').trim();
  const name = capitalizeName(rawName);
  const hasNamePrefix = rawName.length > 0 && message && (message.startsWith(rawName) || message.toLowerCase().startsWith(rawName.toLowerCase()));
  const restOfMessage = hasNamePrefix ? message.slice(rawName.length).trimStart() : null;

  return (
    <Pressable
      style={[styles.notificationItem, !isRead && styles.notificationItemUnread]}
      onPress={() => onPress(item, type)}
    >
      <Image source={{ uri: image }} style={styles.avatar} />
      <View style={styles.notificationContent}>
        <View style={styles.notificationTextRow}>
          <Text style={styles.notificationText} numberOfLines={3}>
            {hasNamePrefix ? (
              <>
                <Text style={styles.notificationTextBold}>{name}</Text>
                {restOfMessage ? ` ${restOfMessage}` : ''}
              </>
            ) : (
              message
            )}
          </Text>
          {createdAt && (
            <Text style={styles.notificationTime}>{formatDateTime(createdAt)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const NotificationScreen = () => {
  const navigation = useNavigation();
  const userId = getUserId();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleNotificationPress = useCallback(
    (item, type) => {
      const actorUserId = item?.actorUserId ?? item?.actorUser?.id;
      const targetId = item?.targetId;
      const actorUsername = item?.actorUsername ?? 'User';

      switch (type) {
        case TYPE_FOLLOW:
          if (actorUserId) {
            navigation.navigate('Profiles', { userId: actorUserId });
          }
          break;
        case TYPE_MESSAGE:
          if (targetId && actorUserId) {
            navigation.navigate('ChatScreen', {
              threadId: targetId,
              otherUserId: actorUserId,
              otherUsername: actorUsername,
            });
          } else {
            navigation.navigate('Chat');
          }
          break;
        case TYPE_LIKE:
        case TYPE_COMMENT:
        default:
          if (targetId) {
            navigation.navigate('PostPreview', { postId: targetId });
          }
          break;
      }
    },
    [navigation]
  );

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await getNotifications(userId, 0, 50);
      const list = Array.isArray(res?.data) ? res.data : [];
      setNotifications(list);
      const unreadIds = list.filter((n) => !n.isRead).map((n) => n.id).filter(Boolean);
      if (unreadIds.length > 0) {
        await markNotificationsSeen(unreadIds);
      }
    } catch (e) {
      console.warn('Notifications load error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      if (userId) load();
    }, [userId, load])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const sections = useMemo(
    () => getNotificationSections(notifications),
    [notifications]
  );

  if (loading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            image={getAvatarUri(item.actorUserId)}
            message={item.message}
            actorName={item.actorFullName ?? item.actorUsername}
            notificationType={item.notificationType}
            createdAt={item.createdDate ?? item.createdAt}
            isRead={item.isRead}
            onPress={handleNotificationPress}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.orange]} tintColor={colors.orange} />
        }
        style={styles.list}
        contentContainerStyle={[styles.listContent, sections.length === 0 && styles.listContentEmpty]}
        ListEmptyComponent={sections.length === 0 ? <Text style={styles.empty}>No notifications yet.</Text> : null}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 8,
    marginHorizontal: 16,
    color: '#000',
  },
  list: { flex: 1 },
  listContent: { paddingBottom: 24 },
  listContentEmpty: { flexGrow: 1 },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  notificationItemUnread: {
    backgroundColor: 'rgba(212, 138, 74, 0.08)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  notificationContent: { flex: 1 },
  notificationTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    marginRight: 8,
  },
  notificationTextBold: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
    paddingHorizontal: 24,
  },
});

export default NotificationScreen;
