import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';

const SocialImg = ({imageSource, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={imageSource}
        style={{
          width: 32,
          height: 32,
          alignSelf: 'center',
        }}
      />
    </TouchableOpacity>
  );
};

export default SocialImg;

const styles = StyleSheet.create({});
