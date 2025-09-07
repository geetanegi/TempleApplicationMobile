import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color, {colors} from '../../global/theme/index';

const ControlCenter = () => {
  const playbackState = usePlaybackState();

  // Next Button
  const skipToNext = async () => {
    const queue = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentIndex !== null && currentIndex < queue.length - 1) {
      await TrackPlayer.skipToNext();
    }
  };

  const skipToPrevious = async () => {
    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentIndex !== null && currentIndex > 0) {
      await TrackPlayer.skipToPrevious();
    }
  };

  // Play / Pause
  const togglePlayback = async playback => {
    const currentTrack = await TrackPlayer.getActiveTrack();
    if (currentTrack != null) {
      if (playback === State.Paused || playback === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={skipToPrevious}>
        <Icon color={colors.DARK_GREY} size={40} name={'skip-previous'} />
      </Pressable>

      <Pressable
        style={styles.playBtn}
        onPress={() => togglePlayback(playbackState.state)}>
        <Icon
          size={44}
          color={'#FFFF'}
          style={styles.playBtn}
          name={playbackState.state === State.Playing ? 'pause' : 'play-arrow'}
        />
      </Pressable>

      <Pressable onPress={skipToNext}>
        <Icon color={colors.DARK_GREY} size={40} name={'skip-next'} />
      </Pressable>
    </View>
  );
};

export default ControlCenter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 56,
    gap: 6,
  },
  playBtn: {
    backgroundColor: 'orange',
    borderRadius: 100,
    padding: 4,
  },
});
