/**
 * @format
 */

import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppRegistry, LogBox} from 'react-native';
import {Text, TextInput} from 'react-native';
import App from './src/App';
import {
  ASYNC_STORAGE_PENDING_PUSH_NAV,
} from './src/utils/push/notificationEvents';

/** Tap on a Notifee notification shown from the JS background handler (e.g. data-only FCM). */
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    try {
      const data = detail?.notification?.data;
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        await AsyncStorage.setItem(ASYNC_STORAGE_PENDING_PUSH_NAV, JSON.stringify(data));
      }
    } catch (_) {}
  }
});

/** Data-only messages while app is backgrounded / quit (notification block shows automatically otherwise). */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await notifee.createChannel({
    id: 'social',
    name: 'Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
  const hasNotificationBlock = remoteMessage?.notification;
  const data = remoteMessage?.data || {};
  if (!hasNotificationBlock && (data.title || data.body)) {
    await notifee.displayNotification({
      title: String(data.title || 'Notification'),
      body: String(data.body || ''),
      android: {
        channelId: 'social',
        pressAction: {id: 'default'},
      },
      data,
    });
  }
});
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {playbackService} from './musicPlayerService';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
