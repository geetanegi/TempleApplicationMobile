import { InteractionManager } from 'react-native';
import { CommonActions } from '@react-navigation/native';
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

function goHomeNested(screen, params) {
  if (!navigationRef.isReady()) return false;
  try {
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'Dashboard',
        params: {
          screen: 'Home',
          params: params != null ? { screen, params } : { screen },
        },
      }),
    );
    return true;
  } catch (e) {
    if (__DEV__) {
      console.warn('[FCM] navigate failed', screen, e?.message || e);
    }
    return false;
  }
}

/**
 * Open the right in-app screen from FCM / Notifee data (push tap).
 *
 * FOLLOW  → Profiles (actor)
 * MESSAGE → ChatScreen (thread) or Chat list
 * LIKE / COMMENT → PostPreview (post) or Notifications (reel / missing id)
 */
export function navigateFromPushPayload(data, opts = {}) {
  const { waitForSplash = false } = opts;
  const payload = data && typeof data === 'object' ? data : {};
  const type = String(payload.notificationType || '').toUpperCase();
  const targetKind = String(payload.targetKind || '').toLowerCase();
  const targetId = parseId(payload.targetId);
  const actorUserId = parseId(payload.actorUserId);
  const actorUsername =
    payload.actorFullName || payload.actorUsername || payload.actorName || 'User';

  if (__DEV__) {
    console.log('[FCM] open navigate', { type, targetKind, targetId, actorUserId });
  }

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

    let ok = false;
    switch (type) {
      case TYPE_FOLLOW:
        ok = actorUserId
          ? goHomeNested('Profiles', { userId: actorUserId })
          : goHomeNested('Notifications');
        break;
      case TYPE_MESSAGE:
        if (targetId && actorUserId) {
          ok = goHomeNested('ChatScreen', {
            threadId: targetId,
            otherUserId: actorUserId,
            otherUsername: actorUsername,
            otherName: actorUsername,
            otherUserHandle: actorUsername,
          });
        } else {
          ok = goHomeNested('Chat');
        }
        break;
      case TYPE_LIKE:
      case TYPE_COMMENT:
        if (targetKind === 'reel') {
          // No dedicated reel-preview route from push yet — open bell list
          ok = goHomeNested('Notifications');
        } else if (targetId) {
          ok = goHomeNested('PostPreview', { postId: targetId });
        } else {
          ok = goHomeNested('Notifications');
        }
        break;
      default:
        ok = goHomeNested('Notifications');
        break;
    }

    if (ok) {
      finished = true;
    } else if (attempts < MAX_ATTEMPTS) {
      setTimeout(tryNavigate, RETRY_MS);
    }
  };

  InteractionManager.runAfterInteractions(() => {
    const initialDelay = waitForSplash ? SPLASH_MS + SPLASH_BUFFER_MS : 0;
    setTimeout(tryNavigate, initialDelay);
  });
}
