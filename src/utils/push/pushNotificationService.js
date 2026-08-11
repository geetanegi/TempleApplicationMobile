import messaging from '@react-native-firebase/messaging';

import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform, PermissionsAndroid, DeviceEventEmitter } from 'react-native';

import { registerFcmDeviceToken, unregisterFcmDeviceToken } from '../apicalls/socialHandler';

import {

  NOTIFICATION_BELL_REFRESH,

  ASYNC_STORAGE_PENDING_BELL_FROM_NOTIFEE_BG,

  ASYNC_STORAGE_PENDING_PUSH_NAV,

} from './notificationEvents';

import { navigateFromPushPayload } from './navigateFromPushPayload';



export { NOTIFICATION_BELL_REFRESH } from './notificationEvents';



const CHANNEL_ID = 'social';



/** Call on logout: unregister token with backend (best-effort). */
export async function clearPushOnLogout() {
  try {
    const token = await messaging().getToken();
    if (token) {
      await unregisterFcmDeviceToken(token);
    }
  } catch (e) {
    console.warn('[FCM] clearPushOnLogout', e?.message || e);
  }
}



async function ensureChannel() {

  if (Platform.OS === 'android') {

    await notifee.createChannel({

      id: CHANNEL_ID,

      name: 'Notifications',

      importance: AndroidImportance.HIGH,

      sound: 'default',

      vibration: true,

    });

  }

}



function extractTitleBody(remoteMessage) {

  const n = remoteMessage?.notification;

  const d = remoteMessage?.data || {};

  const title = n?.title ?? d.title ?? d.notificationTitle ?? 'Notification';

  const body = n?.body ?? d.body ?? d.message ?? '';

  return { title: String(title), body: String(body) };

}



async function storePendingPushNav(data) {

  try {

    if (data && typeof data === 'object' && Object.keys(data).length > 0) {

      await AsyncStorage.setItem(ASYNC_STORAGE_PENDING_PUSH_NAV, JSON.stringify(data));

    } else {

      await AsyncStorage.setItem(ASYNC_STORAGE_PENDING_BELL_FROM_NOTIFEE_BG, '1');

    }

  } catch (_) {}

}



async function consumePendingPushNav() {

  try {

    const raw = await AsyncStorage.getItem(ASYNC_STORAGE_PENDING_PUSH_NAV);

    if (raw) {

      await AsyncStorage.removeItem(ASYNC_STORAGE_PENDING_PUSH_NAV);

      const data = JSON.parse(raw);

      DeviceEventEmitter.emit(NOTIFICATION_BELL_REFRESH);

      navigateFromPushPayload(data, { waitForSplash: true });

      return true;

    }

    const legacy = await AsyncStorage.getItem(ASYNC_STORAGE_PENDING_BELL_FROM_NOTIFEE_BG);

    if (legacy === '1') {

      await AsyncStorage.removeItem(ASYNC_STORAGE_PENDING_BELL_FROM_NOTIFEE_BG);

      DeviceEventEmitter.emit(NOTIFICATION_BELL_REFRESH);

      navigateFromPushPayload({}, { waitForSplash: true });

      return true;

    }

  } catch (_) {}

  return false;

}



function handlePushOpen(data, waitForSplash = false) {

  DeviceEventEmitter.emit(NOTIFICATION_BELL_REFRESH);

  navigateFromPushPayload(data || {}, { waitForSplash });

}



/**

 * Register FCM listeners and (when userId is set) send token to backend.

 * Call only while user is logged in; cleanup on logout.

 */

export function initPushNotifications(userId) {

  const unsubscribers = [];



  ensureChannel().catch(() => {});



  void (async () => {

    try {

      if (Platform.OS === 'android' && Platform.Version >= 33) {

        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      }

      const authStatus = await messaging().requestPermission();

      const ok =

        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||

        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!ok) return;



      const token = await messaging().getToken();

      if (token) {
        console.log('[FCM] FULL TOKEN', token);
      }

      if (token && userId) {

        await registerFcmDeviceToken(userId, token);

      }

    } catch (e) {

      console.warn('[FCM] init token', e?.message || e);

    }

  })();



  unsubscribers.push(

    messaging().onTokenRefresh(async (newToken) => {

      if (newToken && userId) {

        await registerFcmDeviceToken(userId, newToken);

      }

    }),

  );



  unsubscribers.push(

    messaging().onMessage(async (remoteMessage) => {

      await ensureChannel();

      DeviceEventEmitter.emit(NOTIFICATION_BELL_REFRESH);

      const { title, body } = extractTitleBody(remoteMessage);

      const data = {};
      const raw = remoteMessage?.data || {};
      Object.keys(raw).forEach((k) => {
        data[k] = raw[k] == null ? '' : String(raw[k]);
      });

      try {

        await notifee.displayNotification({

          title,

          body,

          data,

          android: {

            channelId: CHANNEL_ID,

            pressAction: { id: 'default' },

            importance: AndroidImportance.HIGH,

            sound: 'default',

            smallIcon: 'ic_launcher',

          },

        });

      } catch (e) {

        console.warn('[FCM] foreground display', e?.message || e);

      }

    }),

  );



  unsubscribers.push(

    messaging().onNotificationOpenedApp((remoteMessage) => {

      handlePushOpen(remoteMessage?.data, false);

    }),

  );



  messaging()

    .getInitialNotification()

    .then((remoteMessage) => {

      if (remoteMessage) {

        handlePushOpen(remoteMessage?.data, true);

      }

    })

    .catch(() => {});



  void consumePendingPushNav();



  void (async () => {

    try {

      const initial = await notifee.getInitialNotification();

      if (initial?.notification?.data) {

        handlePushOpen(initial.notification.data, true);

      }

    } catch (_) {}

  })();



  const offNotifee = notifee.onForegroundEvent(({ type, detail }) => {

    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {

      handlePushOpen(detail?.notification?.data, false);

    }

  });



  return () => {

    unsubscribers.forEach((u) => {

      try {

        if (typeof u === 'function') u();

      } catch (_) {}

    });

    try {

      offNotifee();

    } catch (_) {}

  };

}



export { storePendingPushNav };


