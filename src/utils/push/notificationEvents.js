/** DeviceEventEmitter event — refresh bell badge from server */
export const NOTIFICATION_BELL_REFRESH = 'notification-bell-refresh';

/** Notifee background press → open bell after cold start (legacy; prefer PENDING_PUSH_NAV) */
export const ASYNC_STORAGE_PENDING_BELL_FROM_NOTIFEE_BG = '@pending_open_bell_from_notifee_bg';

/** JSON FCM/Notifee data payload to navigate after cold start from push tap */
export const ASYNC_STORAGE_PENDING_PUSH_NAV = '@pending_push_nav_payload';
