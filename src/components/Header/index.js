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
import Icon from 'react-native-vector-icons/Octicons';
import st from '../../global/styles';
import {useDispatch} from 'react-redux';
import {clearLogin, setLogin} from '../../redux/reducers/Login';
import {SafeAreaView} from 'react-native-safe-area-context';
import { cleanLogindata, setLogindata } from '../../redux/reducers/Logindata';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Header = ({navigation, title, leftImg, backIcon ,profileIcon}) => {

  const dispatch = useDispatch();

  // const toggleDrawer = () => {
  //   navigation.toggleDrawer();
  // };

 const logout = () => {
  dispatch(clearLogin());
  dispatch(cleanLogindata());
 }

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View style={styles.headerArea}>
        <View style={{flexDirection: 'row', alignItems: 'center' }}>
          {backIcon && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={images.backIconHeader} style={styles.leftImage} />
            </TouchableOpacity>
          )}
          {!backIcon && leftImg == 'cart' && (
            <AntDesign
              name="shoppingcart"
              size={SIZES.SIZES_24}
              color={colors.grey}
            />
          )}
          {!backIcon && <Image source={leftImg} style={styles.leftImage} />}
          <Text style={[st.headerLeftTitle, {left: backIcon ? 15 : 5,fontSize: leftImg == 'cart' ? 14 : 16}]}>
            {title}
          </Text>
        </View>

        <View style={[st.row, st.align_C]}>
          <Pressable>
            <Icon
              name={'search'}
              size={20}
              color={colors.ICON_GREY}
              style={{marginRight: 20}}
            />
          </Pressable>
          { leftImg !== 'cart' &&
          <Pressable onPress={() => logout()}>
            <Icon
              name={'sign-out'}
              size={20}
              color={colors.ICON_GREY}
              style={{marginRight: 20}}
            />
          </Pressable>
}
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Icon
              style={{marginRight: 20}}
              name={'bell'}
              size={20}
              color={colors.ICON_GREY}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image
              source={images.user} // Replace with actual profile image URI
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

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
});
