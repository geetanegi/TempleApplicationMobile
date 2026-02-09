/**
 * WebSocket service using SockJS + STOMP for chat and notifications.
 * Connect once per app; subscribe to /topic/notifications/{userId} and /topic/chat/thread/{threadId}.
 */
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { environment } from '../constant';

let stompClient = null;
let subscriptions = {};
const WS_PATH = '/ws';

function getWsUrl() {
  const base = environment.baseUrl.replace(/\/api\/?$/, '');
  return base.replace(/^https?:\/\//, '') + WS_PATH;
}

function getWsFullUrl() {
  const base = environment.baseUrl.replace(/\/api\/?$/, '');
  return base + WS_PATH;
}

/**
 * Connect to WebSocket. Use base URL with http(s) for SockJS.
 * @param {object} callbacks - { onNotifications: (payload) => {}, onChatMessage: (threadId, message) => {} }
 * @returns {Promise<Client>}
 */
export function connectWebSocket(userId, callbacks = {}) {
  return new Promise((resolve, reject) => {
    if (stompClient?.connected) {
      resolve(stompClient);
      return;
    }
    const url = getWsFullUrl();
    const socket = new SockJS(url);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        stompClient = client;
        if (userId && callbacks.onNotifications) {
          const sub = client.subscribe('/topic/notifications/' + userId, (message) => {
            try {
              const body = JSON.parse(message.body);
              callbacks.onNotifications(body);
            } catch (e) {
              console.warn('WebSocket notification parse error', e);
            }
          });
          subscriptions['notifications'] = sub;
        }
        resolve(client);
      },
      onStompError: (frame) => {
        console.warn('STOMP error', frame);
        reject(new Error(frame.headers?.message || 'WebSocket error'));
      },
    });
    client.activate();
  });
}

/**
 * Subscribe to chat thread for real-time messages.
 * @param {number} threadId
 * @param {(message: object) => void} onMessage
 * @returns {object} subscription - call .unsubscribe() to remove
 */
export function subscribeChatThread(threadId, onMessage) {
  if (!stompClient?.connected) {
    console.warn('WebSocket not connected, cannot subscribe to thread', threadId);
    return null;
  }
  const key = 'chat_' + threadId;
  if (subscriptions[key]) {
    subscriptions[key].unsubscribe();
  }
  const sub = stompClient.subscribe('/topic/chat/thread/' + threadId, (message) => {
    try {
      const body = JSON.parse(message.body);
      onMessage(body);
    } catch (e) {
      console.warn('WebSocket chat message parse error', e);
    }
  });
  subscriptions[key] = sub;
  return sub;
}

export function unsubscribeChatThread(threadId) {
  const key = 'chat_' + threadId;
  if (subscriptions[key]) {
    subscriptions[key].unsubscribe();
    delete subscriptions[key];
  }
}

export function disconnectWebSocket() {
  if (stompClient) {
    try {
      stompClient.deactivate();
    } catch (e) {
      console.warn('WebSocket disconnect error', e);
    }
    stompClient = null;
    subscriptions = {};
  }
}

export function isWebSocketConnected() {
  return stompClient?.connected === true;
}
