import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const CREAM = '#FFF8E7';
const WHITE = '#FFFFFF';

const splashImage = require('../../../assets/images/splash.png');

const Splash = () => {
  return (
    <LinearGradient
      colors={[CREAM, WHITE, CREAM]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.center}>
        <Image
          source={splashImage}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: 280,
    height: 280,
    maxWidth: '85%',
  },
});
