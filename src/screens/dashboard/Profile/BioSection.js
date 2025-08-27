import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BioSection = ({bio}) => (
  <View style={styles.bioSection}>
    <Text style={styles.bio}>{bio}</Text>
  </View>
);

const styles = StyleSheet.create({
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
});

export default BioSection;
