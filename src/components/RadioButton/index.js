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

const RadioButton = ({
  navigation,
  options,
  onPressRadio,
  selectedOption,
  fromRequestVedio,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
      }}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => onPressRadio(option.value)}>
          <View style={styles.radioCircle}>
            {selectedOption === option.value && (
              <View style={styles.selectedRb} />
            )}
          </View>
          {fromRequestVedio ? (
            <></>
          ) : (
            <View
              style={[
                styles.radioButtonArea,
                {backgroundColor: option.backgroundClr},
              ]}>
              <AntDesign
                name={option.icon}
                size={SIZES.SIZES_15}
                color={option.tintClr}
              />
            </View>
          )}
          <Text style={[styles.optionText, {left: fromRequestVedio ? 5 : 0}]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.SIZES_5,
  },
  radioCircle: {
    height: SIZES.SIZES_16,
    width: SIZES.SIZES_16,
    borderRadius: SIZES.SIZES_8,

    borderWidth: SIZES.SIZES_2,
    borderColor: colors.BORDER_GREY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: SIZES.SIZES_8,
    height: SIZES.SIZES_8,
    borderRadius: SIZES.SIZES_4,
    backgroundColor: colors.BLUE_COLOR,
  },
  optionText: {
    fontSize: SIZES.SIZES_13,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.PRIMARY_DARK,
  },
  radioButtonArea: {
    marginHorizontal: SIZES.SIZES_10,
    paddingHorizontal: SIZES.SIZES_4,
    paddingVertical: SIZES.SIZES_2,
    borderRadius: SIZES.SIZES_4,
  },
});
