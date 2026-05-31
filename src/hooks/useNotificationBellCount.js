import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { DeviceEventEmitter } from 'react-native';
import { getNotificationsCount } from '../utils/apicalls/socialHandler';
import { NOTIFICATION_BELL_REFRESH } from '../utils/push/notificationEvents';

/**
 * Server-backed unread notification count for the bell badge.
 * Refreshes when push notifications arrive (FCM) or when NOTIFICATION_BELL_REFRESH fires.
 */
export function useNotificationBellCount() {
  const userId = useSelector((s) => s.logindata?.data?.userId);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!userId) {
      setCount(0);
      return;
    }
    try {
      const res = await getNotificationsCount(userId);
      const c = res?.data != null ? Number(res.data) : 0;
      setCount(Number.isFinite(c) ? c : 0);
    } catch {
      /* keep previous count */
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(NOTIFICATION_BELL_REFRESH, refresh);
    return () => sub.remove();
  }, [refresh]);

  return { count, refresh };
}
