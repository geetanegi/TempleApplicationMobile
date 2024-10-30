import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { usePlaybackState, useProgress, Capability, State } from 'react-native-track-player';
import { images } from '../../../global/theme';

// Function to set up the player with configurations and add a track
const setupPlayer = async () => {
  try {
    // Initialize the player
    await TrackPlayer.setupPlayer();

    // Update player options to set capabilities
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
      ],
    });

    // Add a track to the player queue
    await TrackPlayer.add({
      id: 'track1',
      url: 'https://file-examples.com/storage/fe58a1f07d66f447a9512f1/2017/11/file_example_MP3_700KB.mp3', // Replace with your track URL
      title: 'Sample Song',
      artist: 'Artist Name',
      artwork: images.bhakti, // Replace with artwork URL if available
    });
  } catch (error) {
    Alert.alert('Setup Error', 'Error setting up the player. Please try again.');
    console.error('Error setting up the player:', error);
  }
};

const SongPlayer = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Set up the player and add a track when the component mounts
    setupPlayer();

    // Clean up the player when the component unmounts
    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  const togglePlayback = async () => {
    try {
      // Toggle play and pause based on the current playback state
      if (playbackState === State.Playing) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      Alert.alert('Playback Error', 'Error toggling playback. Please try again.');
      console.error('Error toggling playback:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sample Song</Text>
      <Text style={styles.artist}>Artist Name</Text>

      {/* Slider for displaying and controlling progress */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position}
        minimumTrackTintColor="#FF8C00"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FF8C00"
        onSlidingComplete={async (value) => {
          try {
            await TrackPlayer.seekTo(value);
          } catch (error) {
            Alert.alert('Seek Error', 'Error seeking in the track. Please try again.');
            console.error('Error seeking:', error);
          }
        }}
      />

      {/* Playback Control */}
      <View style={styles.controls}>
        <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlayback} />
      </View>

      <Text style={styles.time}>
        {new Date(progress.position * 1000).toISOString().substr(14, 5)} /{' '}
        {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  artist: { fontSize: 18, color: 'gray', marginBottom: 20 },
  slider: { width: '90%', height: 40 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginTop: 20 },
  time: { marginTop: 10, fontSize: 16 },
});

export default SongPlayer;
