import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {API} from '../../../utils/endpoints';
import {postAuth} from '../../../utils/apicalls/postApi';
import {
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  WEIGHT,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT} from '../../../global/theme';
import AppText from '../../../components/AppText';
import ButtonCheckout from '../../../components/ButtonCheckout';

const HitTheGreen = ({navigation, route, onPress}) => {
  const [proximity, setProximity] = useState('');
  const [queuecount, setQueueCount] = useState();

  // const saveProximiti = async () => {
  //   try {
  //     const url = API.RECORD_RESULT;
  //     const params = {
  //       cqrIds: [9],
  //       recordTime: '2024-10-01T13:05:51Z',
  //       hitGreen: false,
  //       missedGreen: false,
  //       holeInOne: true,
  //       score: '2',
  //       proximity: proximity,
  //     };
  //     const result = await postAuth(url, params)
  //       .then(data => {
  //         setQueueCount(data?.data);
  //         console.log('-----data--result----', data);
  //         //   setIsLoading(false);
  //       })
  //       .catch(err => {
  //         //   setIsLoading(false);
  //         throw err;
  //       });
  //   } catch (err) {
  //     // setIsLoading(false);
  //   }
  // };
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordHitTheGreen = data => {
    onPress(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={{width: WIDTH.WIDTH_100}}>
          <CustomTextComponent
            title={APP_TEXT.HIT_THE_GREEN}
            style={styles.welcome}
          />
        </View>
        <CustomTextComponent
          title={APP_TEXT.GREEN_REGULATION}
          style={[
            styles.ruleTxt,
            {fontSize: SIZES.SIZES_14, paddingVertical: PADDING.PADDING_20},
          ]}
        />
        <View style={styles.instructionsContainer}>
          <CustomTextComponent
            title={APP_TEXT.RULE_MSG}
            style={styles.ruleTxt}
          />
          <CustomTextComponent
            title={APP_TEXT.RULE_POINT}
            style={styles.ruleTxt}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            maxLength={6}
            style={styles.input}
            value={proximity}
            onChangeText={setProximity}
            keyboardType="numeric"
            placeholder=""
          />
          <Text style={[styles.ruleTxt, {left: SIZES.SIZES_20}]}>FT</Text>
        </View>

        <View style={[styles.BtnContainer]}>
          <ButtonCheckout
            title={APP_TEXT.SUBMIT_PROXIMITY}
            onPressCheckout={() => _recordHitTheGreen(proximity)}
            img={false}
          />
        </View>

        <View style={styles.footerButtons}>
          <TouchableOpacity onPress={onPress}>
            <Image source={images.skipButton} style={styles.submitBtn} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPress}>
            <Image source={images.backButton} style={styles.backButton} />
          </TouchableOpacity>
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
    borderRadius: SIZES.SIZES_12,
    borderColor: colors.grey,
    borderWidth: SIZES.SIZES_1,
    width: WIDTH.WIDTH_98,
  },
  card: {
    width: WIDTH.WIDTH_95,
    borderRadius: SIZES.SIZES_8,
    alignItems: 'center',
    paddingVertical: SIZES.SIZES_10,
  },
  instructionsContainer: {
    borderColor: colors.COLOR_BORDER,
    borderWidth: BORDERWIDTH.BORDERWIDTH_PONT_SEVEN,
    borderRadius: SIZES.SIZES_10,
    padding: SIZES.SIZES_15,
    marginBottom: SIZES.SIZES_20,
  },
  inputContainer: {
    paddingVertical: SIZES.SIZES_10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: SIZES.SIZES_80,
    height: SIZES.SIZES_48,
    borderWidth: SIZES.SIZES_1,
    borderColor: colors.grey,
    color:'black',
    backgroundColor: colors.BG_LIGHT,
    borderRadius: SIZES.SIZES_4,
    fontSize: SIZES.SIZES_18,
    textAlign: 'center',
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
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  BtnContainer: {
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    marginHorizontal: SIZES.SIZES_15,
    marginVertical: SIZES.SIZES_10,
  },
  backButton: {
    width: SIZES.SIZES_91,
    height: SIZES.SIZES_36,
  },
  submitBtn: {
    width: SIZES.SIZES_218,
    height: SIZES.SIZES_36,
  },
});

export default HitTheGreen;
