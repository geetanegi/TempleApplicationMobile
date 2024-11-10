import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  WEIGHT,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT} from '../../../global/theme';
import AppText from '../../../components/AppText';

const RecordResults = ({onPress}) => {
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordData = data => {
    onPress(data);
  };

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.card}>
        <CustomTextComponent
          title={'Record your results'}
          style={[styles.welcome, {top: -20}]}
        />
        <TouchableOpacity
          style={styles.buttonGreen}
          onPress={() => _recordData('Recordyourresults')}>
          <CustomTextComponent
            title={APP_TEXT.BTN_HIT_THE_GREEN}
            style={[
              styles.welcome,
              {color: colors.white, fontSize: SIZES.SIZES_14},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonGreen}
          onPress={() => _recordData('MissedtheGreen')}>
          <CustomTextComponent
            title={APP_TEXT.BTN_MISSED_GREEN}
            style={[
              styles.welcome,
              {color: colors.white, fontSize: SIZES.SIZES_14},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _recordData('HoleInOne')}>
          <Image source={images.holeOne} style={styles.goldBtn} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.PADDING_20,
    backgroundColor: colors.white,
    borderRadius: RADIUS.RADIUS_12,
    borderColor: colors.grey,
    borderWidth: BORDERWIDTH.BORDERWIDTH_1,
    width: WIDTH.WIDTH_98,
  },
  card: {
    width: WIDTH.WIDTH_95,
    borderRadius: RADIUS.RADIUS_8,
    alignItems: 'center',
    paddingVertical: SIZES.SIZES_80,
  },
  buttonGreen: {
    backgroundColor: colors.LIGHT_RED,
    height: SIZES.SIZES_37,
    width: SIZES.SIZES_288,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.RADIUS_6,
    marginVertical: MARGIN.MARGIN_10,
  },
  buttonText: {
    color: colors.white,
    fontSize: SIZES.SIZES_16,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  welcome: {
    fontSize: FONTSIZE.FONTSIZE_16,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  goldBtn: {
    width: SIZES.SIZES_288,
    height: SIZES.SIZES_40,
    borderRadius: RADIUS.RADIUS_6,
    marginVertical: MARGIN.MARGIN_10,
  },
});

export default RecordResults;
