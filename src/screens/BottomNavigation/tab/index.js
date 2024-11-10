import {
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Keyboard,
  Linking,
  ImageBackground,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {useDispatch, useSelector} from 'react-redux';
import {setLogin} from '../../../redux/reducers/Login';
import LoginImg from '../../../components/loginImage';
import Checkbox from 'react-native-check-box';
import {API} from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import {
  ValidatePassword,
  ValidateUserName,
} from '../../../utils/helperfunctions/validations';
import {View} from 'react-native-animatable';
import AdminInput from '../../../components/adminInput';
import SocialLogin from '../../../components/SocialLogin';
import ApplicationButton from '../../../components/ApplicationButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {setLogindata} from '../../../redux/reducers/Logindata';
import PopUpMessage from '../../../components/popup';
import {onLogin} from '../../../utils/helperfunctions/tiggerfunction';
import {requestLocationPermission} from '../../../utils/helperfunctions/location';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import {storeTokenData} from '../../../utils/apicalls/tokenApi';
import useNetworkStatus from '../../../hooks/networkStatus';
import {environment} from '../../../utils/constant';
import FloatingInput from '../../../components/floating_Input';
import TransparentHeader from '../../../components/TransparentHeader';
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
  // userName: '',
};

const Login = ({navigation}) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberBtn, setRememberBtn] = useState(false);
  const [myDeviceInfo, setMyDeviceInfo] = useState('');
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [warning, setWarning] = useState(false);
  const isConnected = useNetworkStatus();
  const feedbackUrl = environment.feedbackUrl;
  const beneficiaryRegistration = environment.BeneficiaryRegistration;

  const dispatch = useDispatch();

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
      const validPassword = ValidatePassword(text);
      if (validPassword == 'success') {
        handleError('', 'password');
      } else {
        handleError(validPassword, 'password');
        isValid = false;
      }
    }

    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const feedbackformRedirect = () => {
    // Linking.openURL(feedbackUrl);
    navigation.navigate(NAVIGATION.TO_FORGET_PASSWORD);
  };

  const BeneficiaryformRedirect = () => {
    Linking.openURL(beneficiaryRegistration);
  };

  const validation = async () => {
    Keyboard.dismiss();
    const validNumber = ValidateUserName(inputs?.username);
    let isValid = true;
    const validPassword = ValidatePassword(inputs?.password);

    if (validNumber != 'success') {
      handleError(validNumber, 'username');
      isValid = false;
    } else {
      handleError('', 'username');
    }
    if (validPassword == 'success') {
      handleError('', 'password');
    } else {
      handleError(validPassword, 'password');
      isValid = false;
    }
    if (isValid) {
      if (isChecked) {
        await AsyncStorage.setItem('username', inputs?.username);
        await AsyncStorage.setItem('password', inputs?.password);
      }
      handleSubmitPress();
    }
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

  const handleSubmitPress = async () => {
    const url = API.LOGIN_AUTH;
    const params = {
      username: inputs?.username,
      password: inputs?.password,
      mode: 'Mobile',
    };
    setIsLoading(true);
    postNoAuth(url, params)
      .then(result => {
        if (!result?.error) {
          // console.log('----------------------------result-----------------',result)
          setIsLoading(false);
          storeTokenData(result?.data?.token);
          dispatch(setLogindata(result?.data));
          dispatch(setLogin(true));
          setWarning(false);
          onLogin();
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

  const getInfoHandle = async () => {
    let deviceId = DeviceInfo.getDeviceId();
    const deviceName = await DeviceInfo.getDeviceName();
    const data = {
      deviceId,
      deviceName,
    };
    setMyDeviceInfo(data);
    await requestLocationPermission();
  };

  useEffect(() => {
    const checkRememberMe = async () => {
   //   const savedEmail = await AsyncStorage.getItem('username');
    //  const savedPassword = await AsyncStorage.getItem('password');

    //  console.log('------savedEmail------',savedEmail)
    //  console.log('------savedPassword------',savedPassword)
      // if (savedEmail && savedPassword) {
      //   setInputs(prevState => ({...prevState, username: savedEmail}));
      //   setInputs(prevState => ({...prevState, password: savedPassword}));
      // }
    };
    checkRememberMe();
  }, []);

  const onSocialLogin = VAL => {
    alert(VAL);
  };

  return (
    <ImageBackground style={{flex: 1}} source={images.loginBG}>
    
      <ScrollView keyboardShouldPersistTaps={'handled'}>
      <TransparentHeader />
        <View style={[st.card, st.mt_t200, styles.container]}>
          <LoginImg />
          <View style={styles.socialIconView}>
            <SocialLogin onSocialLogin={onSocialLogin} data={dataSocialIcons} />
          </View>
          <Text
            style={[
              st.tx16,
              st.pv20,
              st.mt_t_10,
              {color: colors.PRIMARY_DARK},
            ]}>
            {APP_TEXT.LOGIN_OR}
          </Text>
          <View style={[st.cardsty, st.shadowProp]}>
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

            {/* <FloatingInput
              label={'FULL NAME'}
              onChangeText={text => handleOnchange(text, 'name')}
              onFocus={() => handleError(null, 'name')}
              error={errors?.name}
              value={inputs.name}
              // iconName={images.user}
              inputsty={st.inputsty}
              placeholderTextColor={'#fff'}
            /> */}
            <View style={st.mt_t20}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.LOGIN_PASSWORD}
                onChangeText={text => handleOnchange(text, 'password')}
              //  onFocus={() => handleError(null, 'password')}
                error={errors?.password}
                password
                label={''}
                value={inputs?.password}
              />
            </View>

            <View>
              <Pressable
                onPress={() => {
                  setRememberBtn(!rememberBtn);
                }}>
                <View style={[st.row, st.align_C, st.mt_t10]}>
                  <Checkbox
                    isChecked={isChecked}
                    onClick={() => setIsChecked(!isChecked)}
                    checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
                  />
                  <Text
                    style={[st.tx14_B, {color: colors.PRIMARY_DARK, left: 15}]}>
                    {APP_TEXT.LOGIN_REMEMBER_ME}
                  </Text>
                </View>
              </Pressable>

              <ApplicationButton
                label={APP_TEXT.LOGIN_LOGIN}
                backgroundColor={colors.PRIMARY_BUTTON}
                onButtonPress={() => {
                  // dispatch(setLogin(true));
                  validation();
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Text
                style={[
                  styles.accountCreate,
                  {color: colors.PRIMARY_DARK, marginTop: 10},
                ]}>
                {APP_TEXT.LOGIN_DONT_HAVE_AN_ACCOUNT}
                <Text
                  onPress={() => {
                    navigation.navigate(NAVIGATION.TO_SIGNUP);
                  }}
                  style={styles.txtForgotPwd}>
                  {APP_TEXT.LOGIN_SIGNUP}
                </Text>
              </Text>
              <Pressable
                onPress={() => {
                  feedbackformRedirect();
                }}>
                <View style={[]}>
                  <Text
                    style={[styles.txtForgotPwd, {top: 5, marginRight: -13}]}>
                    {'      '}
                    {APP_TEXT.LOGIN_FORGET_PASSWORD}
                  </Text>
                </View>
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

export default Login;