import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, colors} from '../../global/theme';
import Icon from 'react-native-vector-icons/Octicons';
import st from '../../global/styles';
import {useDispatch, useSelector} from 'react-redux';
import {clearLogin} from '../../redux/reducers/Login';
import {color} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

const ButtonCheckout = ({navigation, onPressCheckout}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPressCheckout()}
      style={styles.CheckoutBtn}>
      <View style={styles.chectoutButton}>
        <AntDesign
          name="shoppingcart"
          size={SIZES.SIZES_19}
          color={colors.white}
        />
        <Text style={styles.CheckoutTitle}>{'Checkout'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonCheckout;

const styles = StyleSheet.create({
  CheckoutTitle: {
    color: '#FFF',
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
    marginLeft: SIZES.SIZES_10,
  },
  CheckoutBtn: {
    width: WIDTH.WIDTH_100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chectoutButton: {
    height: SIZES.SIZES_36,
    width: WIDTH.WIDTH_100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.PRIMARY_BUTTON,
    borderRadius: RADIUS.RADIUS_6,
  },
});
