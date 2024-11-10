import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
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
import {colors, APP_TEXT} from '../../../global/theme';
import AppText from '../../../components/AppText';

const AccessVedioRequestModal = ({navigation,onPress}) => {

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordNext = data => {
    onPress(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={{width: WIDTH.WIDTH_100, flexDirection: 'row'}}>
          <CustomTextComponent
            title={APP_TEXT.HIT_THE_GREEN}
            style={styles.welcome}
          />
          <CustomTextComponent title={'  >  '} style={styles.welcome} />
          <CustomTextComponent title={'28.50 FT'} style={styles.welcome} />
          <CustomTextComponent title={'  >  '} style={styles.welcome} />
          <CustomTextComponent title={'[3]'} style={styles.welcome} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <CustomTextComponent
            title={APP_TEXT.THAKS_FOR_RECORDING}
            style={[
              styles.ruleTxt,
              {fontSize: SIZES.SIZES_14, paddingVertical: PADDING.PADDING_20},
            ]}
          />
        </View>

        <View style={styles.instructionsContainer}>
          <CustomTextComponent 
            title={APP_TEXT.ACCESS_VEDIO}
            style={[styles.ruleTxt, {paddingVertical: PADDING.PADDING_20}]}
          />
          <TouchableOpacity onPress={()=>navigation.navigate("VedioHighlights")}>
            <CustomTextComponent
              title={APP_TEXT.HIGHLIGHT_HUB}
              style={[
                styles.ruleTxt,
                {
                  fontSize: SIZES.SIZES_14,
                  color: colors.PRIMARY_BUTTON,
                  textDecorationLine: 'underline',
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <CustomTextComponent
          title={APP_TEXT.ACHIEVEMENT_UNCLOCK}
          style={[
            styles.ruleTxt,
            {
              fontSize: SIZES.SIZES_14,
              paddingVertical: PADDING.PADDING_20,
              fontFamily: family.semibold,
              fontWeight: WEIGHT.WEIGHT_600,
              color: colors.LIGHT_RED,
            },
          ]}
        />
        <TouchableOpacity
          onPress={() => _recordNext('next')}
          style={styles.skipButton}>
          <Text style={styles.skipButtonText}>{APP_TEXT.NEXT}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.PADDING_20,
    backgroundColor: colors.white,
    borderRadius: RADIUS.RADIUS_12,
    borderColor: colors.grey,
    borderWidth: SIZES.SIZES_1,
    width: WIDTH.WIDTH_98,
  },
  card: {
    width: WIDTH.WIDTH_95,
    borderRadius: RADIUS.RADIUS_8,
    alignItems: 'center',
    paddingVertical: PADDING.PADDING_10,
  },
  instructionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.COLOR_BORDER,
    borderWidth: BORDERWIDTH.BORDERWIDTH_PONT_SEVEN,
    borderRadius: RADIUS.RADIUS_10,
    paddingHorizontal: PADDING.PADDING_10,
    paddingVertical: PADDING.PADDING_10,
    marginBottom: MARGIN.MARGIN_20,
  },
  skipButton: {
    borderRadius: RADIUS.RADIUS_6,
    height: SIZES.SIZES_36,
    backgroundColor: colors.PRIMARY_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    paddingHorizontal: PADDING.PADDING_20,
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  welcome: {
    fontSize: FONTSIZE.FONTSIZE_16,
    color: colors.PRIMARY_DARK,
    fontFamily: family.medium,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
});

export default AccessVedioRequestModal;
