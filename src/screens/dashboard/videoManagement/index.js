import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';

const VideoPlayer = () => {
  const [paused, setPaused] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // Can be a URL or a local file.
        style={styles.video}
        controls={true}
        paused={paused}
        // resizeMode="contain"
        onError={(error) => console.log('Error:', error)} // Callback when video cannot be loaded
        onFullscreenPlayerWillPresent={() => setFullscreen(true)}
        onFullscreenPlayerDidDismiss={() => setFullscreen(false)}
      />

      {/* Play/Pause Button */}
      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setPaused(!paused)}
      >
        <Text style={styles.controlText}>{paused ? 'Play' : 'Pause'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 250,
  },
  controlButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default VideoPlayer;
