import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
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

const AchievementScreen = ({onPress}) => {
  const [score, setScore] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const scoreOne = APP_TEXT.FIRST_RANK_MSG;
  const scoreTwo = APP_TEXT.SECOND_RANK_MSG;
  const scoreThree = APP_TEXT.THIRD_RANK_MSG;
  const scoreFour = APP_TEXT.FOURTH_RANK_MSG;
  const scoreFive = APP_TEXT.FIGTH_RANK_MSG;
  const scoreSix = APP_TEXT.SIXTH_RANK_MSG;

  const renderCirclesInInput = () => {
    if (score == 1) {
      return (
        <>
          <View style={[styles.circle, styles.outerCircle]} />
          <View style={styles.circle} />
        </>
      );
    } else if (score == 2) {
      return <View style={[styles.circle]} />;
    } else if (score == 3) {
      return <></>;
    } else if (score == 4) {
      return <View style={[styles.singleSquare]} />;
    } else if (score == 5) {
      return (
        <>
          <View style={[styles.singleSquare, styles.outerSquare]} />
          <View style={styles.singleSquare} />
        </>
      );
    } else if (score == 6) {
      return (
        <>
          <View style={[styles.singleSquare, styles.outerSquare]} />
          <View style={styles.singleSquare} />
        </>
      );
    }
    return null; // No circles for other inputs
  };

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const handleInput = txt => {
    const number = parseInt(txt, 10);

    if (!isNaN(number) && number <= 6) {
      setErrorMessage('');
    } else if (txt === '') {
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter a number between 1 and 6');
    }

    setScore(txt);
    if (txt == 1) {
      setMessage(scoreOne);
    } else if (txt == 2) {
      setMessage(scoreTwo);
    } else if (txt == 3) {
      setMessage(scoreThree);
    } else if (txt == 4) {
      setMessage(scoreFour);
    } else if (txt == 5) {
      setMessage(scoreFive);
    } else if (txt == 6) {
      setMessage(scoreSix);
    } else {
      setMessage('');
    }
  };

  const _achievementData = data => {
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
        </View>
        <View style={{flexDirection: 'row'}}>
          <CustomTextComponent
            title={APP_TEXT.GREAT_SHOT}
            style={[
              styles.ruleTxt,
              {fontSize: SIZES.SIZES_14, paddingVertical: PADDING.PADDING_20},
            ]}
          />
          <CustomTextComponent
            title={' - inside 30 feet!'}
            style={[
              styles.ruleTxt,
              {
                fontSize: SIZES.SIZES_14,
                paddingVertical: PADDING.PADDING_20,
                fontWeight: WEIGHT.WEIGHT_700,
              },
            ]}
          />
        </View>

        <View style={styles.instructionsContainer}>
          <CustomTextComponent
            title={APP_TEXT.ENTER_SCORE}
            style={[styles.ruleTxt, {paddingVertical: PADDING.PADDING_10}]}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={score}
              onChangeText={val => handleInput(val)}
              keyboardType="numeric"
              placeholder={APP_TEXT.PLACEHOLDER_SCORE}
              placeholderTextColor={colors.LIGHT_GREY}
              maxLength={1}
            />
            {renderCirclesInInput()}
          </View>
          {errorMessage ? (
            <CustomTextComponent
              title={errorMessage}
              style={[
                styles.ruleTxt,
                {fontSize: SIZES.SIZES_14, color: colors.LIGHT_RED},
              ]}
            />
          ) : null}
          {score === '' ? (
            <></>
          ) : (
            <CustomTextComponent
              title={message}
              style={[
                styles.ruleTxt,
                {
                  fontSize: SIZES.SIZES_14,
                  paddingVertical: PADDING.PADDING_20,
                  fontFamily: family.semibold,
                  fontWeight: WEIGHT.WEIGHT_600,
                },
              ]}
            />
          )}

          <View style={styles.footerButtons}>
            {score == 1 ? (
              <TouchableOpacity onPress={() => _achievementData(score)}>
                <Image source={images.holeInOne} style={styles.goldBtn} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => _achievementData(score)}>
                <Image source={images.submitScore} style={styles.submitBtn} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onPress}>
              <Image source={images.backButton} style={styles.backButton} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.SIZES_20,
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
    paddingVertical: SIZES.SIZES_10,
  },
  instructionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.COLOR_BORDER,
    borderWidth: BORDERWIDTH.BORDERWIDTH_PONT_SEVEN,
    borderRadius: RADIUS.RADIUS_10,
    paddingHorizontal: SIZES.SIZES_10,
    paddingVertical: SIZES.SIZES_20,
    marginBottom: MARGIN.MARGIN_20,
  },
  inputContainer: {
    paddingVertical: SIZES.SIZES_10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: SIZES.SIZES_80,
    height: SIZES.SIZES_48,
    borderWidth: SIZES.SIZES_1,
    borderColor: colors.grey,
    backgroundColor: colors.BG_LIGHT,
    borderRadius: RADIUS.RADIUS_6,
    fontSize: SIZES.SIZES_18,
    textAlign: 'center',
    color:'black'
  },
  footerButtons: {
    flexDirection: 'row',
    top: SIZES.SIZES_10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTH.WIDTH_100,
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
  circle: {
    position: 'absolute',
    top: SIZES.SIZES_8,
    right: SIZES.SIZES_15,
    width: SIZES.SIZES_50,
    height: SIZES.SIZES_50,
    borderRadius: SIZES.SIZES_30,
    borderWidth: SIZES.SIZES_3,
    borderColor: colors.BLUE_COLOR,
  },
  outerCircle: {
    width: SIZES.SIZES_60,
    height: SIZES.SIZES_60,
    borderWidth: SIZES.SIZES_3,
    borderColor: colors.BLUE_COLOR,
    top: SIZES.SIZES_3,
    right: SIZES.SIZES_10,
  },
  singleSquare: {
    position: 'absolute',
    top: SIZES.SIZES_8,
    right: SIZES.SIZES_15,
    width: SIZES.SIZES_50,
    height: SIZES.SIZES_50,
    borderWidth: SIZES.SIZES_3,
    borderColor: colors.PRIMARY_SOLID_TEXT,
  },
  outerSquare: {
    width: SIZES.SIZES_60,
    height: SIZES.SIZES_60,
    borderWidth: SIZES.SIZES_3,
    borderColor: colors.PRIMARY_SOLID_TEXT,
    top: SIZES.SIZES_3,
    right: SIZES.SIZES_10,
  },
  backButton: {
    width: SIZES.SIZES_91,
    height: SIZES.SIZES_36,
  },
  goldBtn: {
    width: SIZES.SIZES_194,
    height: SIZES.SIZES_40,
  },
  submitBtn: {
    width: SIZES.SIZES_194,
    height: SIZES.SIZES_36,
  },
});

export default AchievementScreen;
