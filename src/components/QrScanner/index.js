import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {images} from '../../global/theme';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QrScanner = () => {
  return (
    <View>
        <QRCodeScanner
      onRead={({dats}) => alert(data)}
      flashMode={RNCamera.Constants.FlashMode.torch}
      reactivate={true}
      reactivateTimeout={500}
      />
      {/* <Image source={images.SplashScreen} style={{width:'100%'}} /> */}
    </View>
  );
};

export default QrScanner;

const styles = StyleSheet.create({});
