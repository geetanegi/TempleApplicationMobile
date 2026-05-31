import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initPushNotifications } from '../utils/push/pushNotificationService';

/**
 * Initializes Firebase Cloud Messaging after login. Tear down on logout.
 */
function pickUserId(state) {
  const d = state.logindata?.data;
  if (d == null) return null;
  const id = d.userId ?? d.id;
  if (id == null || id === '') return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

export default function PushNotificationBootstrap() {
  const userId = useSelector(pickUserId);

  useEffect(() => {
    if (userId == null) return undefined;
    const cleanup = initPushNotifications(userId);
    return cleanup;
  }, [userId]);

  return null;
}
