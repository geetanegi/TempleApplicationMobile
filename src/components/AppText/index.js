import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';

import {family, WEIGHT, FONTSIZE, SIZES,color} from '../../global/fonts';
import {colors, images} from '../../global/theme';

const AppText = ({children, style, ...props}) => {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  defaultText: {
    color: colors.PRIMARY_LIGHT_TEXT,
    fontSize: FONTSIZE.FONTSIZE_13,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
   },
});
