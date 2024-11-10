import {
  View,
  ImageBackground,
  Image,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import React from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';

const Splash = () => {
  return (
    <ImageBackground
      source={images.loginBG}
      // resizeMode={'stretch'}
      style={st.flex}>
      <ScrollView style={{flex: 1}}>
        <View style={[st.mt_t200, styles.container]}>
          <View>
            {/* <Image source={images.loginLogo} style={styles.imgLogo} /> */}
          </View>
          {/* <View style={styles.txtView}>
            <Text style={st.hardText}>{APP_TEXT.SPLASH_APP_NAME}</Text>
            <Text style={[st.tx16, {color: colors.white}]}>
              {APP_TEXT.SPLASH_TEXT}
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  imgLogo: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginTop: -10,
  },
  txtView: {marginTop: -15, alignItems: 'center'},
});
