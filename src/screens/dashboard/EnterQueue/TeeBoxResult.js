import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';

import {
  size,
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
import {colors, APP_TEXT, NAVIGATION} from '../../../global/theme';
import AppText from '../../../components/AppText';
import ButtonCheckout from '../../../components/ButtonCheckout';
import { useFocusEffect } from '@react-navigation/native';

const TeeBoxResults = ({navigation, route, onPress}) => {
  const [minutes, setMinutes] = useState(2); // Initial minutes value
  const [seconds, setSeconds] = useState(58); // Initial seconds value
  const [nextPlayerSeconds, setNextPlayerSeconds] = useState(28); // Countdown for next player

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);


    const nextPlayerTimer = setInterval(() => {
      if (nextPlayerSeconds > 0) {
        setNextPlayerSeconds(nextPlayerSeconds - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(nextPlayerTimer);
    };
  }, [seconds, minutes, nextPlayerSeconds]);


  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        // handleBackPress,
      );
   //   startSync(); // Fetch the data when the screen is focused
      return () => backHandler.remove();
    }, []),
  );

  const handleBackPress = () => {
    console.log('--back--')
    navigation.goBack()
    return true;
  };

  const handleSubmit = () => {
    console.log('inn');
    navigation.navigate('RecordResults');
  };

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: SIZES.SIZES_30,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CustomTextComponent
          title={'MeTizio'}
          style={[
            styles.welcome,
            {
              fontSize: FONTSIZE.FONTSIZE_20,
              color: colors.PRIMARY_DARK,
              fontWeight: WEIGHT.WEIGHT_700,
            },
          ]}
        />
        <CustomTextComponent
          title={APP_TEXT.YOU_ARE_ON_TEE}
          style={[
            styles.welcome,
            {
              fontSize: FONTSIZE.FONTSIZE_18,
              color: colors.PRIMARY_DARK,
              top: SIZES.SIZES_3,
            },
          ]}
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          You have{' '}
          <Text style={styles.highlight}>
            [{minutes} {APP_TEXT.MINUTES} {seconds} {APP_TEXT.SECONDS}]
          </Text>{' '}
          {APP_TEXT.TO_HIT_GREEN}{' '}
          <Text style={styles.highlight}>[28 seconds]</Text>{' '}
          {APP_TEXT.BEFORE_NEXT_PLAYER}
        </Text>
      </View>
      <Text style={styles.questionText}>{APP_TEXT.DID_YOU_HIT}</Text>
      <View style={[styles.BtnContainer]}>
        <ButtonCheckout
          title={APP_TEXT.RECORD_MY_RESULT}
          onPressCheckout={onPress}
          img={false}
        />
      </View>
      <Text style={styles.noteText}>{APP_TEXT.NOTE}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.PADDING_20,
    backgroundColor: colors.white,
    borderRadius: RADIUS.RADIUS_8,
  },
  infoBox: {
    backgroundColor: colors.BACKGROUD_GREY_COLOR,
    padding: PADDING.PADDING_20,
    borderWidth: BORDERWIDTH.BORDERWIDTH_1,
    borderColor: colors.COLOR_BORDER,
    marginBottom: MARGIN.MARGIN_20,
    width: WIDTH.WIDTH_100,
    alignItems: 'center',
    borderRadius: RADIUS.RADIUS_8,
  },
  infoText: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  highlight: {
    fontWeight: WEIGHT.WEIGHT_700,
    fontSize: FONTSIZE.FONTSIZE_16,
    color: colors.black,
  },
  questionText: {
    fontStyle: 'italic',
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  noteText: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
    paddingVertical: PADDING.PADDING_10,
  },
  welcome: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  BtnContainer: {
    alignItems: 'center',
    marginHorizontal: MARGIN.MARGIN_15,
    marginVertical: MARGIN.MARGIN_20,
  },
});

export default TeeBoxResults;
