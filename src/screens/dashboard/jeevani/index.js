import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const JeevaniScreen = () => {
  return (
    <View style={styles.container}>
      <Text>JeevaniScrenn</Text>
    </View>
  );
};

export default JeevaniScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
