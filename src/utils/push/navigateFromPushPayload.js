import { InteractionManager } from 'react-native';
import { navigationRef } from '../../route';
import { store } from '../../redux/store';

const SPLASH_MS = 2000;
const SPLASH_BUFFER_MS = 400;
const RETRY_MS = 280;
const MAX_ATTEMPTS = 48;

const TYPE_FOLLOW = 'FOLLOW';
const TYPE_MESSAGE = 'MESSAGE';
const TYPE_LIKE = 'LIKE';
const TYPE_COMMENT = 'COMMENT';

function parseId(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

/**
 * Open the right in-app screen from FCM / Notifee data (push tap only — not external links).
 *
 * @param {Record<string, string>|null|undefined} data
 * @param {{ waitForSplash?: boolean }} opts
 */
export function navigateFromPushPayload(data, opts = {}) {
  const { waitForSplash = false } = opts;
  const payload = data && typeof data === 'object' ? data : {};
  const type = String(payload.notificationType || '').toUpperCase();
  const targetId = parseId(payload.targetId);
  const actorUserId = parseId(payload.actorUserId);
  const actorUsername = payload.actorUsername || 'User';

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
      switch (type) {
        case TYPE_FOLLOW:
          if (actorUserId) {
            navigationRef.navigate('Dashboard', {
              screen: 'Home',
              params: { screen: 'Profiles', params: { userId: actorUserId } },
            });
          } else {
            navigationRef.navigate('Dashboard', {
              screen: 'Home',
              params: { screen: 'Notifications' },
            });
          }
          break;
        case TYPE_MESSAGE:
          if (targetId && actorUserId) {
            navigationRef.navigate('Dashboard', {
              screen: 'Home',
              params: {
                screen: 'ChatScreen',
                params: {
                  threadId: targetId,
                  otherUserId: actorUserId,
                  otherUsername: actorUsername,
                  otherName: actorUsername,
                  otherUserHandle: actorUsername,
                },
              },
            });
          } else {
            navigationRef.navigate('Dashboard', {
              screen: 'Home',
              params: { screen: 'Chat' },
            });
          }
          break;
        case TYPE_LIKE:
        case TYPE_COMMENT:
        default:
          if (targetId) {
            navigationRef.navigate('Dashboard', {
              screen: 'Home',
              params: {
                screen: 'PostPreview',
                params: { postId: targetId },
              },
            });
          } else {
            navigationRef.navigate('Dashboard', {
              screen: 'Home',
              params: { screen: 'Notifications' },
            });
          }
          break;
      }
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
