import {View, StyleSheet} from 'react-native';
import React from 'react';
const TransparentHeader = () => {
  return <View style={styles.backView} />;
};

const styles = StyleSheet.create({
  backView: {
    top: 0,
    height: 60,
    left: 0,
    right: 0,
  },
});

export default TransparentHeader;
