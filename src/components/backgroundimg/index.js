import React from 'react';
import {View, ImageBackground} from 'react-native';
import {images} from '../../global/theme';
const Background = ({ children }) => {
  return (
    <View>
      <ImageBackground source={images.SplashScreen}  style={{ flex:1}} />
      {/* <View style={{ position: "absolute" }}>
        {children}
      </View> */}
    </View>
  );
}

export default Background;