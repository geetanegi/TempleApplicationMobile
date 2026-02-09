import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../global/theme';
import { getUserId } from '../../../redux/store/getState';
import { getNotifications, markNotificationsSeen } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

function getAvatarUri(actorUserId) {
  if (!actorUserId) return 'https://i.pravatar.cc/150?img=3';
  const url = getProfilePictureUrlByUserId(actorUserId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return 'https://i.pravatar.cc/150?img=3';
}

const NotificationItem = ({ image, message, notificationType, createdAt, isRead }) => (
  <View style={[styles.notificationItem, !isRead && styles.notificationItemUnread]}>
    <Image source={{ uri: image }} style={styles.avatar} />
    <View style={styles.notificationContent}>
      <Text style={styles.notificationText}>{message}</Text>
      {createdAt && (
        <Text style={styles.notificationTime}>
          {typeof createdAt === 'string' ? new Date(createdAt).toLocaleDateString() : ''}
        </Text>
      )}
    </View>
  </View>
);

const NotificationScreen = () => {
  const userId = getUserId();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NotificationItem
            image={getAvatarUri(item.actorUserId)}
            message={item.message}
            notificationType={item.notificationType}
            createdAt={item.createdDate}
            isRead={item.isRead}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.orange]} tintColor={colors.orange} />
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
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
  notificationText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
    paddingHorizontal: 24,
  },
});

export default NotificationScreen;
