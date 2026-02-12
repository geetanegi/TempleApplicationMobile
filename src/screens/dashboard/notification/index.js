import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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

const TYPE_FOLLOW = 'FOLLOW';
const TYPE_MESSAGE = 'MESSAGE';
const TYPE_LIKE = 'LIKE';
const TYPE_COMMENT = 'COMMENT';

const NotificationItem = ({ item, image, message, notificationType, createdAt, isRead, onPress }) => {
  const type = (notificationType || '').toUpperCase();
  return (
    <Pressable
      style={[styles.notificationItem, !isRead && styles.notificationItemUnread]}
      onPress={() => onPress(item, type)}
    >
      <Image source={{ uri: image }} style={styles.avatar} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{message}</Text>
        {createdAt && (
          <Text style={styles.notificationTime}>
            {typeof createdAt === 'string' ? new Date(createdAt).toLocaleDateString() : ''}
          </Text>
        )}
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
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            image={getAvatarUri(item.actorUserId)}
            message={item.message}
            notificationType={item.notificationType}
            createdAt={item.createdDate}
            isRead={item.isRead}
            onPress={handleNotificationPress}
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
