import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MusicPlayer from '../musicPlayer';
import Video from '../../../components/VideoPlayer';

const JeevaniScreen = () => {
  return (
    <View style={styles.container}>
      {/* <MusicPlayer /> */}
      <Video />
    </View>
  );
};

export default JeevaniScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  comment: {
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
