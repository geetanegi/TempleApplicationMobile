import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, colors} from '../../global/theme';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../global/fonts';
import st from '../../global/styles';
import {useDispatch} from 'react-redux';
import {clearLogin, setLogin} from '../../redux/reducers/Login';
import {SafeAreaView} from 'react-native-safe-area-context';
import {cleanLogindata, setLogindata} from '../../redux/reducers/Logindata';
import AppText from '../AppText';
const DrawerHeader = ({navigation, title, leftImg, backIcon, profileIcon}) => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View style={styles.headerArea}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity 
          // onPress={() => navigation.navigate('Notification')}
          >
            <Image
              source={images.user} // Replace with actual profile image URI
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View>
            <AppText style={styles.name}>{title}</AppText>
            {/* <AppText style={styles.playerDetails}>
              {'HDCP: 1.5  •  GHIN: 2460170'}
            </AppText> */}
          </View>
        </View>

        {/* <View style={[st.row, st.align_C]}>
          <View>
            <AppText style={styles.balance}>{'$290.00'}</AppText>
            <AppText style={styles.playerACC}>{'ACC: 35'}</AppText>
          </View>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default DrawerHeader;

const styles = StyleSheet.create({
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  leftImage: {
    width: 24,
    height: 24,
  },
  headerArea: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.grey,
    backgroundColor: colors.white,
  },
  ///
  name: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.black,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    marginLeft: 15,
  },
  playerDetails: {
    fontSize: FONTSIZE.FONTSIZE_8,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    marginLeft: 15,
  },
  balance: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.PRIMARY_SOLID_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
    marginLeft: 15,
  },
  playerACC: {
    fontSize: FONTSIZE.FONTSIZE_8,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    marginLeft: 15,
  },
});
