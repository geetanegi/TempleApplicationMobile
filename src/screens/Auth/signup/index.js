import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  ScrollView,
  Pressable,
  Keyboard,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import st from '../../../global/styles';
import LoginImg from '../../../components/loginImage';
import AdminInput from '../../../components/adminInput';
import TransparentHeader from '../../../components/TransparentHeader';
import FullScreenLoader from '../../../components/FullScreenLoader';
import ApplicationButton from '../../../components/ApplicationButton';
import SocialLogin from '../../../components/SocialLogin';
import Checkbox from 'react-native-check-box';
import {
  ValidatePassword,
  ValidateUserName,
  ValidatefirstName,
  ValidatelastName,
  ValidateMail,
  ValidateMobile,
  ValidateGHIN,
  ValidateCardNumber,
  ValidateCVV,
} from '../../../utils/helperfunctions/validations';
import Toast from 'react-native-simple-toast';
import MydatePicker from '../../../components/datePicker';
import {API} from '../../../utils/endpoints';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
import useNetworkStatus from '../../../hooks/networkStatus';
import {useFocusEffect} from '@react-navigation/native';
import { historyDownload } from '../../../utils/helperfunctions/functions';
const Instagram = require('../../../images/Instagram.png');
const Facebook = require('../../../images/Facebook.png');
const TikTok = require('../../../images/TikTok.png');
const Google = require('../../../images/Google.png');

const dataSocialIcons = [
  {id: '1', name: Instagram, button: 'instagramLogIn'},
  {id: '2', name: Facebook, button: 'facebookLogIn'},
  {id: '3', name: TikTok, button: 'tikTokLogIn'},
  {id: '4', name: Google, button: 'googleLogIn'},
];

const INITIALINPUT = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  confirmPassword: '',
  DOB: '',
  emailId: '',
  mobile: '',
  countryCode: '',
  GHIN: '',
  cardNumber: '',
  expiryDate: '',
  CVV: '',
  nameOnCard: '',
  Terms: '',
};

const Signup = ({navigation}) => {
  const [errors, setErrors] = useState(INITIALINPUT);
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [disabled, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const isConnected = useNetworkStatus();
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [warning, setWarning] = useState(false);

  const handleSubmitPress = async () => {
    const url = API.REGISTER_USER;
    const params = {
      dateOfBirth: inputs?.DOB,
      emailId: inputs?.emailId,
      firstName: inputs?.firstName,
      lastName: inputs?.lastName,
      mobile: inputs?.mobile,
      password: inputs?.password,
      username: inputs?.username,
    };
    setIsLoading(true);
    postNoAuth(url, params)
      .then(result => {
        if (!result?.error) {
          setIsLoading(false);
          const data = {
            emailId: inputs?.emailId,
            message: result?.data?.message,
            token: result?.data?.token,
          };
          Toast.show(result?.data?.message);

          // setTitle('OTP sent successfully!');
          // setWarning(false);
          // setSubtitle(result?.data?.message);
          // setPopupMessageVisibility(true);
          navigation.navigate(NAVIGATION.TO_OTP_SCREEN, {item: data});
        } else {
          setIsLoading(false);
          setTitle('Oops!');
          setWarning(false);
          setSubtitle(result?.description);
          setPopupMessageVisibility(true);
        }
      })
      .catch(err => {
        //console.log('LOGIN_AUTH catch', err);
        setIsLoading(false);
        if (err?.status === 303) {
          setTitle('Warning!');
          setWarning(true);
        } else {
          setTitle('Oops!');
          setWarning(false);
        }
        setSubtitle(err?.message);
        setPopupMessageVisibility(true);
      })
      .finally(() => {
        //console.log('LOGIN_AUTH finally');
        setIsLoading(false);
      });
  };
  const isEmpty = str => {
    return !str || str.trim() === '';
  };

  const validation = () => {
    Keyboard.dismiss();

    if (!isChecked) {
      handleError(
        'You must agree to the Terms and Conditions to proceed',
        'Terms',
      );
    }

    if (isEmpty(inputs.username)) {
      const validNumber = ValidateUserName(null);
      handleError(validNumber, 'username');
    }
    if (isEmpty(inputs.password)) {
      const validNumber = ValidatePassword(null);
      handleError(validNumber, 'password');
    }
    if (isEmpty(inputs.confirmPassword)) {
      const validNumber = ValidatePassword(null);
      handleError(validNumber, 'confirmPassword');
    }
    if (isEmpty(inputs.firstName)) {
      const validNumber = ValidatefirstName(null);
      handleError(validNumber, 'firstName');
    }
    if (isEmpty(inputs.lastName)) {
      const validNumber = ValidatelastName(null);
      handleError(validNumber, 'lastName');
    }
    if (isEmpty(inputs.emailId)) {
      const validNumber = ValidateMail(null);
      handleError(validNumber, 'emailId');
    }
    // if (inputs.GHIN) {
    //   const validNumber = ValidateGHIN(null);
    //   handleError(validNumber, 'GHIN');
    // }

    if (
      isEmpty(errors.username) &&
      isEmpty(errors.password) &&
      isEmpty(errors.confirmPassword) &&
      isEmpty(errors.firstName) &&
      isEmpty(errors.lastName) &&
      isEmpty(errors.emailId) &&
      isEmpty(errors.GHIN) &&
      isEmpty(errors.DOB) &&
      isEmpty(errors.mobile) &&
      isEmpty(errors.countryCode) &&
      isEmpty(errors.cardNumber) &&
      isEmpty(errors.expiryDate) &&
      isEmpty(errors.CVV) &&
      isEmpty(errors.nameOnCard) &&
      isChecked == true
    ) {
    //  console.log('LOGIN_AUTH finally');
       handleSubmitPress();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );
  const handleBackPress = () => {
    navigation.navigate(NAVIGATION.TO_LOGIN);
    return true;
  };

  const handleOnchange = (text, input) => {
    if (input == 'username') {
      const validNumber = ValidateUserName(text);
      let isValid = true;
      if (validNumber != 'success') {
        handleError(validNumber, 'username');
        isValid = false;
      } else {
        handleError('', 'username');
      }
    } else if (input == 'password') {
      let isValid = true;
      const validPassword = ValidatePassword(text);
      if (validPassword == 'success') {
        handleError('', 'password');
      } else {
        handleError(validPassword, 'password');
        isValid = false;
      }
    } else if (input == 'confirmPassword') {
      let isValid = true;
      if (inputs.password != text) {
        handleError(
          'The passwords do not match. Please ensure both password fields are identical',
          'confirmPassword',
        );
        isValid = false;
      } else {
        handleError('', 'confirmPassword');
      }
    } else if (input == 'firstName') {
      let isValid = true;
      const validPassword = ValidatefirstName(text);
      if (validPassword == 'success') {
        handleError('', 'firstName');
      } else {
        handleError(validPassword, 'firstName');
        isValid = false;
      }
    } else if (input == 'lastName') {
      let isValid = true;
      const validPassword = ValidatelastName(text);
      if (validPassword == 'success') {
        handleError('', 'lastName');
      } else {
        handleError(validPassword, 'lastName');
        isValid = false;
      }
    } else if (input == 'emailId') {
      let isValid = true;
      const validPassword = ValidateMail(text);
      if (validPassword == 'success') {
        handleError('', 'emailId');
      } else {
        handleError(validPassword, 'emailId');
        isValid = false;
      }
    } else if (input == 'mobile') {
      let isValid = true;
      const validPassword = ValidateMobile(text);
      if (validPassword == 'success') {
        handleError('', 'mobile');
      } else {
        handleError(validPassword, 'mobile');
        isValid = false;
      }
    } 
    else if (input == 'GHIN') {
      let isValid = true;
      const validPassword = ValidateGHIN(text);
      if (validPassword == 'success') {
        handleError('', 'GHIN');
      } else {
        handleError(validPassword, 'GHIN');
        isValid = false;
      }
    }
    else if (input == 'cardNumber') {
      let isValid = true;
      const validPassword = ValidateCardNumber(text);
      if (validPassword == 'success') {
        handleError('', 'cardNumber');
      } else {
        handleError(validPassword, 'cardNumber');
        isValid = false;
      }
    }
    else if (input == 'CVV') {
      let isValid = true;
      const validPassword = ValidateCVV(text);
      if (validPassword == 'success') {
        handleError('', 'CVV');
      } else {
        handleError(validPassword, 'CVV');
        isValid = false;
      }
    }

    

    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handlechange = (text, input) => {
    setInputs(prevState => ({...prevState, ['DOB']: text.toISOString()}));
  };

  const handleExpirychange = (text, input) => {
    setInputs(prevState => ({...prevState, ['expiryDate']: text.toISOString()}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const onSocialLogin = VAL => {
    alert(VAL);
  };

  const onPopupMessageModalClick = value => {
    if (warning == true) {
      handleSubmitPress();
      setPopupMessageVisibility(value);
    } else {
      setPopupMessageVisibility(value);
    }
  };

  const show_alert_msg = value => {
    return (
      <PopUpMessage
        display={popupMessageVisibility}
        titleMsg={title}
        subTitle={subtitle}
        onModalClick={value => {
          onPopupMessageModalClick(value);
        }}
        twoButton={warning ? true : false}
        onPressNoBtn={() => {
          setWarning(false);
          setPopupMessageVisibility(false);
        }}
      />
    );
  };

  const getpdfFile = async (title, url) => {
    if (!isConnected) {
      onPopupMessageModalClick(true);
      setTitle('No Internet Connection');
      setSubtitle(
        'Please check your Wi-Fi or mobile network connection and try again.',
      );
    } else {
    console.log('--else-----')
       // setSessionPopup(false);
        try {
          setIsLoading(true);
          const result = await historyDownload(title, url);
          if (result) {
            setIsLoading(false);
            Toast.show('Terms and Condition has been downloaded successfully');
            // onPopupMessageModalClick(true);
            // setTitle('Congratulations');
            // setSubtitle('Pdf has been downloaded successfully');
          } else {
            setIsLoading(false);
          }
        } catch (e) {
          setIsLoading(false);
        }
      
      }
  };

  const minDate = new Date();
  const maxDate = new Date();
  return (
    <ImageBackground style={{flex: 1}} source={images.loginBG}>
      {loading && <FullScreenLoader visible={loading} />}

      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <TransparentHeader />
        <View style={[st.card, st.mt_t60, styles.container]}>
          {/* <LoginImg /> */}
          <View style={styles.socialIconView}>
            <SocialLogin onSocialLogin={onSocialLogin} data={dataSocialIcons} />
          </View>
          <Text
            style={[
              st.tx16,
              {color: colors.PRIMARY_DARK, paddingVertical: 20},
            ]}>
            {APP_TEXT.LOGIN_OR}
          </Text>
          <View style={[st.cardsty, st.shadowProp]}>
            <View>
              <AdminInput
                holderName={APP_TEXT.FIRST_NAME}
                isRequired
                onChangeText={text => {
                  handleOnchange(text, 'firstName');
                }}
                //   onFocus={() => handleError(null, 'firstName')}
                error={errors?.firstName}
                value={inputs?.firstName}
                iconName={''}
                label={''}
              />
            </View>
            <View style={[st.mt_t20]}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.LAST_NAME}
                onChangeText={text => {
                  handleOnchange(text, 'lastName');
                }}
                //  onFocus={() => handleError(null, 'lastName')}
                error={errors?.lastName}
                value={inputs?.lastName}
                iconName={''}
                label={''}
              />
            </View>
            <View style={[st.mt_t20]}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.USER_NAME}
                onChangeText={text => {
                  handleOnchange(text, 'username');
                }}
                //   onFocus={() => handleError(null, 'username')}
                error={errors?.username}
                value={inputs?.username}
                iconName={''}
                label={''}
              />
            </View>
            <View style={[st.mt_t20]}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.LOGIN_PASSWORD}
                onChangeText={text => {
                  handleOnchange(text, 'password');
                }}
                //   onFocus={() => handleError(null, 'password')}
                error={errors?.password}
                password
                label={''}
                value={inputs?.password}
              />
            </View>
            <View style={[st.mt_t20]}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.CONFIRM_PASSWORD}
                onChangeText={text => {
                  handleOnchange(text, 'confirmPassword');
                }}
                //  onFocus={() => handleError(null, 'confirmPassword')}
                error={errors?.confirmPassword}
                password
                label={''}
                value={inputs?.confirmPassword}
              />
            </View>
            {/* <View style={[st.mt_t20]}>
              <MydatePicker
                disabled={disabled}
                handleChange={handlechange}
                minDate={minDate}
                selectedValue={inputs?.DOB}
                maxDate={maxDate}
                renderType={'Date of Birth'}
              //  backgroundColor1={colors.PRIMARY_TRANSPARENT_BLACK}
              />
            </View> */}
            <View style={[st.mt_t20]}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.EMAIL}
                onChangeText={text => {
                  handleOnchange(text, 'emailId');
                }}
                //   onFocus={() => handleError(null, 'emailId')}
                error={errors?.emailId}
                value={inputs?.emailId}
                iconName={''}
                label={''}
              />
            </View>
            <View style={[st.mt_t20]}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.PHONE}
                onChangeText={text => {
                  handleOnchange(text, 'mobile');
                }}
                //   onFocus={() => handleError(null, 'emailId')}
                error={errors?.mobile}
                value={inputs?.mobile}
                iconName={''}
                label={''}
              />
            </View>
            {/* <View style={[st.mt_t20]}>
              <AdminInput
                holderName={APP_TEXT.GHIN}
                onChangeText={text => {
                  handleOnchange(text, 'GHIN');
                }}
                //  onFocus={() => handleError(null, 'GHIN')}
                error={errors?.GHIN}
                value={inputs?.GHIN}
                iconName={''}
                label={''}
                keyboardType={'numeric'}
              />
            </View> */}

            {/* <View style={[st.mt_t20]}>
              <Text
                style={[
                  st.temsCondition,
                  {
                    color: colors.black,
                    paddingVertical: 5,
                    fontSize: 18,
                    fontWeight: 500,
                  },
                ]}>
                {APP_TEXT.CARD_INFORMATION}
              </Text>
              <AdminInput
                holderName={APP_TEXT.CARD_NUMBER}
                onChangeText={text => {
                  handleOnchange(text, 'cardNumber');
                }}
                //  onFocus={() => handleError(null, 'cardNumber')}
                error={errors?.cardNumber}
                value={inputs?.cardNumber}
                iconName={''}
                label={''}
                keyboardType={'numeric'}
              />
            </View> */}
            {/* <View style={[st.mt_t20, st.row]}>
              <View style={[st.wdh48]}>
                <MydatePicker
                disabled={disabled}
                handleChange={handleExpirychange}
                minDate={minDate}
                selectedValue={inputs?.expiryDate}
                maxDate={maxDate}
                renderType={'Expiry Date'}
               // backgroundColor1={colors.PRIMARY_TRANSPARENT_BLACK}
              />

              </View>
              <View style={[st.wdh48, st.ml_15,st.mt_t10]}>
                <AdminInput
                  holderName={APP_TEXT.CVV}
                  onChangeText={text => handleOnchange(text, 'CVV')}
                  //   onFocus={() => handleError(null, 'CVV')}
                  error={errors?.CVV}
                  password
                  label={''}
                  value={inputs?.CVV}
                  keyboardType={'numeric'}
                />
              </View>
            </View> */}
            {/* <View style={[st.mt_t20]}>
              <AdminInput
                holderName={APP_TEXT.NAME_ON_CARD}
                onChangeText={text => {
                  handleOnchange(text, 'nameOnCard');
                }}
                //   onFocus={() => handleError(null, 'nameOnCard')}
                error={errors?.nameOnCard}
                value={inputs?.nameOnCard}
                iconName={''}
                label={''}
                keyboardType={'numeric'}
              />
            </View> */}

            {/* <TermsAndCondition/> */}

            <View style={[st.mt_v]}>
              <Pressable
               onPress={() => getpdfFile("terms and condition", "https://morth.nic.in/sites/default/files/dd12-13_0.pdf")}
              >
                <View style={[st.row, st.align_C]}>
                  <Checkbox
                    isChecked={isChecked}
                    error={errors?.Terms}
                    onClick={() => setIsChecked(!isChecked)}
                    checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
                  />
                  <Text
                    style={[
                      st.temsCondition,
                      {color: colors.PRIMARY_DARK, left: 5},
                    ]}>
                    {APP_TEXT.AGREEING_TO}

                    <Text
                      style={[
                        styles.txtForgotPwd,
                        {fontSize: 12, textDecorationLine: 'underline'},
                      ]}>
                      {APP_TEXT.TERMS_AND_CONDITION}
                    </Text>
                    <Text
                      style={[st.temsCondition, {color: colors.PRIMARY_DARK}]}>
                      {APP_TEXT.OF_THE_CONTEST}
                    </Text>
                  </Text>
                </View>
              </Pressable>
              {!isChecked && (
                <Text style={[{color: colors.danger, fontSize: 12}]}>
                  {errors?.Terms}
                </Text>
              )}

              <ApplicationButton
                backgroundColor={colors.PRIMARY_BUTTON}
                label={APP_TEXT.CREATE_ACCOUNT}
                //  disabled={true}
                onButtonPress={() => {
                  validation();
                }}
              />

              <Pressable
                onPress={() => {
                  navigation.navigate(NAVIGATION.TO_LOGIN);
                }}
                style={styles.alreadyAcc}>
                <Text
                  style={[styles.accountCreate, {color: colors.PRIMARY_DARK}]}>
                  {APP_TEXT.ALREADY_HAVE_ACCOUNT}
                </Text>
                <Text style={[styles.txtForgotPwd, {left: 5}]}>
                  {APP_TEXT.LOGIN_LOGIN}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
      {show_alert_msg()}
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
  socialIconView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '80%',
    marginTop:40
  },
  checkedIcon: {
    width: 20,
    height: 20,
    left: 5,
    alignSelf: 'center',
  },
  uncheckedView: {
    height: 20,
    width: 20,
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF',
    left: 5,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginBottom: 100,
  },
  accountCreate: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'justify',
    fontWeight: 400,
  },
  txtForgotPwd: {
    fontSize: 13,
    color: colors.PRIMARY_BLUE_TEXT,
    textAlign: 'justify',
  },
  alreadyAcc: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
