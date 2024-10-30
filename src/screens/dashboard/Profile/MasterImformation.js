import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const MasterInfo = ({firstName, lastName, location}) => {
  return (
    <View>
      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 32.5,
    // marginTop: 10,
    // color: '#333',
  },
  location: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFF',
    lineHeight: 20,
    // marginBottom: 20,
  },
});
export default MasterInfo;
