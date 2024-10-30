import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {images} from '../../global/theme';

const SocialImg = () => {
  return (
    <View>
      <Image
        source={images.loginLogo}
        style={{
          width: 120,
          height: 120,
          alignSelf: 'center',
          marginTop: -60,
        }}
      />
    </View>
  );
};

export default SocialImg;

const styles = StyleSheet.create({});
