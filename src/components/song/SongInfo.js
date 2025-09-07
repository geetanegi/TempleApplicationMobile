import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const SongInfo = ({track}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{track?.title}</Text>
      <Text style={styles.artist}>{track?.artist}</Text>
    </View>
  );
};

export default SongInfo;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  artist: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});
