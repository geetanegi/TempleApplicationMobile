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
import React, {useEffect, useState} from 'react';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import st from '../../../global/styles';
import LoginImg from '../../../components/loginImage';
import AdminInput from '../../../components/adminInput';
import TransparentHeader from '../../../components/TransparentHeader';
import ApplicationButton from '../../../components/ApplicationButton';
import SocialLogin from '../../../components/SocialLogin';
import Checkbox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ValidatePassword,
  ValidateUserName,
} from '../../../utils/helperfunctions/validations';
import {setLogin} from '../../../redux/reducers/Login';
import {storeTokenData} from '../../../utils/apicalls/tokenApi';
import {API} from '../../../utils/endpoints';
import {setLogindata} from '../../../redux/reducers/Logindata';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
import useNetworkStatus from '../../../hooks/networkStatus';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
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
  username: '',
  password: '',
};

const Login = ({navigation}) => {
  const [errors, setErrors] = useState(INITIALINPUT);
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const isConnected = useNetworkStatus();
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [warning, setWarning] = useState(false);
  const [rememberBtn, setRememberBtn] = useState(false);

  const dispatch = useDispatch();

  const feedbackformRedirect = () => {
    // Linking.openURL(feedbackUrl);
    navigation.navigate(NAVIGATION.TO_FORGET_PASSWORD);
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
          setIsLoading(false);
          storeTokenData(result?.data?.token);
          dispatch(setLogindata(result?.data));
          dispatch(setLogin(true));
          setWarning(false);
          //  onLogin();
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
      } else {
        await AsyncStorage.setItem('username', '');
        await AsyncStorage.setItem('password', '');
      }
      handleSubmitPress();
    }
  };

  useEffect(() => {
    getSavedData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      getSavedData();
      return () => {};
    }, []),
  );

  const getSavedData = async () => {
    try {
      const storedUserNameValue = await AsyncStorage.getItem('username');
      const storedUserPassValue = await AsyncStorage.getItem('password');
      if (storedUserNameValue !== null && storedUserPassValue !== null) {
        setInputs(prevState => ({...prevState, username: storedUserNameValue}));
        setInputs(prevState => ({...prevState, password: storedUserPassValue}));
        setIsChecked(true);
      }
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

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

  return (
    <ImageBackground style={{flex: 1}} source={images.loginBG}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <TransparentHeader />
        <View style={[st.card, st.mt_t300, styles.container]}>
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
            <View style={st.mt_t20}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.LOGIN_PASSWORD}
                onChangeText={text => handleOnchange(text, 'password')}
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

const styles = StyleSheet.create({
  socialIconView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '80%',
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
