import TrackPlayer, {Event, RepeatMode} from 'react-native-track-player';
import {musicList} from './src/dummy';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrack();
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTrack() {
  await TrackPlayer.add(musicList);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    const queue = await TrackPlayer.getQueue();
    const index = await TrackPlayer.getActiveTrackIndex();
    if (index !== null && index < queue.length - 1) {
      await TrackPlayer.skipToNext();
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    const index = await TrackPlayer.getActiveTrackIndex();
    if (index !== null && index > 0) {
      await TrackPlayer.skipToPrevious();
    }
  });
};
