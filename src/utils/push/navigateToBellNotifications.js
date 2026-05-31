import { InteractionManager } from 'react-native';
import { navigationRef } from '../../route';
import { store } from '../../redux/store';

/** Must stay in sync with `setTimeout(..., 2000)` splash in `src/route/index.js` */
const SPLASH_MS = 2000;
const SPLASH_BUFFER_MS = 400;
const RETRY_MS = 280;
const MAX_ATTEMPTS = 48;

/**
 * Navigate to the stack screen that matches the header bell / Notifications list.
 * Retries until Redux shows logged-in user and the root navigator is ready (handles splash + persist rehydrate).
 *
 * @param {{ waitForSplash?: boolean }} opts - Set waitForSplash when opening from quit/cold start (FCM / Notifee initial notification).
 */
export function navigateToBellNotificationsScreen(opts = {}) {
  const { waitForSplash = false } = opts;
  let attempts = 0;
  let finished = false;

  const tryNavigate = () => {
    if (finished) return;
    attempts += 1;

    const loggedIn = !!store.getState().login?.data;
    const ready = navigationRef.isReady();

    if (!loggedIn || !ready) {
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(tryNavigate, RETRY_MS);
      }
      return;
    }

    try {
      navigationRef.navigate('Dashboard', {
        screen: 'Home',
        params: { screen: 'Notifications' },
      });
      finished = true;
    } catch {
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(tryNavigate, RETRY_MS);
      }
    }
  };

  InteractionManager.runAfterInteractions(() => {
    const initialDelay = waitForSplash ? SPLASH_MS + SPLASH_BUFFER_MS : 0;
    setTimeout(tryNavigate, initialDelay);
  });
}
