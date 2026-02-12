/**
 * Chat sound effects for send and receive.
 * Uses react-native-sound. Bundled sounds load instantly; remote URLs used as fallback.
 * To use custom sounds: add send.mp3 and receive.mp3 to src/assets/sounds/ and uncomment requires.
 */
import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

// Subtle, soft notification sounds (~1–2 sec, gentle chime)
const SEND_SOUND_URL = 'https://orangefreesounds.com/wp-content/uploads/2024/11/Notification-chime-sound-effect.mp3';
const RECEIVE_SOUND_URL = 'https://orangefreesounds.com/wp-content/uploads/2024/11/Notification-chime-sound-effect.mp3';

// Optional: use your own bundled sounds for offline + custom tone:
// 1. Create folder: src/assets/sounds/
// 2. Add send.mp3 and receive.mp3 (short, subtle MP3s)
// 3. Uncomment below and use SEND_SOUND / RECEIVE_SOUND in loadSound()
// const SEND_SOUND = require('../assets/sounds/send.mp3');
// const RECEIVE_SOUND = require('../assets/sounds/receive.mp3');

let sendSound = null;
let receiveSound = null;

const loadSound = (source, callback) => {
  try {
    const s = new Sound(source, null, (err) => {
      if (err) return callback?.(null);
      callback?.(s);
    });
    return s;
  } catch (e) {
    callback?.(null);
  }
};

export const preloadChatSounds = () => {
  if (!sendSound) loadSound(SEND_SOUND_URL, (s) => { sendSound = s; });
  if (!receiveSound) loadSound(RECEIVE_SOUND_URL, (s) => { receiveSound = s; });
};

export const playSendSound = () => {
  try {
    if (sendSound) {
      sendSound.setVolume(0.35);
      sendSound.play((success) => { if (!success) sendSound?.reset(); });
    } else {
      loadSound(SEND_SOUND_URL, (s) => {
        if (s) { sendSound = s; sendSound.setVolume(0.35); sendSound.play(); }
      });
    }
  } catch (_e) {}
};

export const playReceiveSound = () => {
  try {
    if (receiveSound) {
      receiveSound.setVolume(0.35);
      receiveSound.play((success) => { if (!success) receiveSound?.reset(); });
    } else {
      loadSound(RECEIVE_SOUND_URL, (s) => {
        if (s) { receiveSound = s; receiveSound.setVolume(0.35); receiveSound.play(); }
      });
    }
  } catch (_e) {}
};
