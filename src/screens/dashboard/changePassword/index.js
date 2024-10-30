import {
  StyleSheet,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  Linking,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import React, {useState, useRef, useEffect} from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import Button from '../../../components/button';
import {useDispatch, useSelector} from 'react-redux';
import {setLogin} from '../../../redux/reducers/Login';
import LoginImg from '../../../components/loginImage';
import {API} from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import {
  ValidateMobile,
  ValueEmpty,
  ValidatePassword,
  ValidateUserName,
} from '../../../utils/helperfunctions/validations';
import {View} from 'react-native-animatable';
import AdminInput from '../../../components/adminInput';
import ApplicationButton from '../../../components/ApplicationButton';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import {setLogindata} from '../../../redux/reducers/Logindata';
import PopUpMessage from '../../../components/popup';
import {onLogin} from '../../../utils/helperfunctions/tiggerfunction';
import {requestLocationPermission} from '../../../utils/helperfunctions/location';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import {storeTokenData} from '../../../utils/apicalls/tokenApi';
import useNetworkStatus from '../../../hooks/networkStatus';
import {environment} from '../../../utils/constant';
import PrivacyPolicy from '../../../components/PrivacyPolicy';
import Background from '../../../components/backgroundimg';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const INITIALINPUT = {
  password: '',
  confirmPassword: '',
};

const ChangePassword = ({navigation, route}) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [myDeviceInfo, setMyDeviceInfo] = useState('');
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [warning, setWarning] = useState(false);
  const isConnected = useNetworkStatus();
  const dispatch = useDispatch();

  const handleOnchange = (text, input) => {
    if (input == 'password') {
      const validPassword = ValidatePassword(text);
      if (validPassword == 'success') {
        handleError('', 'password');
      } else {
        handleError(validPassword, 'password');
        isValid = false;
      }
    } else if (input == 'confirmPassword') {
      if (inputs.password != text) {
        handleError(
          'The passwords do not match. Please ensure both password fields are identical',
          'confirmPassword',
        );
        isValid = false;
      } else {
        handleError('', 'confirmPassword');
      }
    }
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
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
    const url = API.RESET_PASSWORD;
    const params = {
      password: inputs?.password,
      token: route?.params?.item.token,
    };
    setIsLoading(true);
    postNoAuth(url, params)
      .then(result => {
        if (!result?.error) {
          setIsLoading(false);
          Toast.show(result?.data?.message);
          navigation.navigate(NAVIGATION.TO_SUCCESS_SCREEN);
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

  useEffect(() => {}, []);

  const isEmpty = str => {
    return !str || str.trim() === '';
  };

  const validation = async () => {
    console.log('----calasd', inputs);
    Keyboard.dismiss();
    if (isEmpty(inputs.password)) {
      const validNumber = ValidatePassword(null);
      handleError(validNumber, 'password');
    }
    if (isEmpty(inputs.confirmPassword)) {
      const validNumber = ValidatePassword(null);
      handleError(validNumber, 'confirmPassword');
    }

    // const validNumber = ValidatePassword(inputs?.password);
    // const validateconfirPassword=validateconfirPassword(inputs?.confirmPassword)
    // let isValid = true;
    // if (validNumber != 'success') {
    //   handleError(validNumber, 'username');
    //   isValid = false;
    // } else {
    //   handleError('', 'username');
    // }
    // if (validateconfirPassword != 'success') {
    //   handleError(validateconfirPassword, 'confirmPassword');
    //   isValid = false;
    // } else {
    //   handleError('', 'confirmPassword');
    // }

    if (!isEmpty(inputs.password) && !isEmpty(inputs.confirmPassword)) {
      handleSubmitPress();
    }
  };

  return (
    <ImageBackground style={{flex: 1}} source={images.loginBG}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={[st.card, st.mt_t300, styles.container]}>
          {/* <LoginImg /> */}
          <View
            style={{
              width: '100%',
              paddingVertical: 30,
              alignItems: 'center',
              marginTop:40
            }}>
            <Text
              style={{
                color: colors.PRIMARY_DARK,
                lineHeight: 19.1,
                padding: 5,
                fontSize: 24,
                textAlign: 'center',
              }}>
              {APP_TEXT.RESET_YOUR_PASSWORD}
            </Text>
          </View>
          <View style={[st.cardsty, st.shadowProp]}>
            <View>
              <AdminInput
                isRequired
                holderName={APP_TEXT.LOGIN_PASSWORD}
                onChangeText={text => {
                  handleOnchange(text, 'password');
                }}
                onFocus={() => handleError(null, 'password')}
                error={errors?.password}
                value={inputs?.password}
                iconName={''}
                label={''}
              />
            </View>
            <View style={st.mt_t20}>
              <AdminInput
                isRequired
                holderName={APP_TEXT.CONFIRM_PASSWORD}
                onChangeText={text => {
                  handleOnchange(text, 'confirmPassword');
                }}
                onFocus={() => handleError(null, 'confirmPassword')}
                error={errors?.confirmPassword}
                value={inputs?.confirmPassword}
                iconName={''}
                label={''}
              />
            </View>

            <View style={[st.mt_B10]}>
              <ApplicationButton
                backgroundColor={colors.PRIMARY_BUTTON}
                label={APP_TEXT.RESET_BUTTON}
                onButtonPress={() => {
                  validation();
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(NAVIGATION.TO_LOGIN);
              }}>
              <Text
                style={[
                  styles.txtSignUp,
                  {
                    color: colors.PRIMARY_BLUE_TEXT,
                    alignSelf: 'center',
                    lineHeight: 19.1,
                    padding: 5,
                  },
                ]}>
                {APP_TEXT.BACK_TO_LOGIN}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
      {show_alert_msg()}
    </ImageBackground>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  gustBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  logincon: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: colors.white,
    padding: 20,
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    marginHorizontal: 16,
  },
  txtSignUp: {
    fontSize: 14,
    color: colors.PRIMARY_SOLID_TEXT,
    // fontFamily: family.semibold,
    textAlign: 'center',
    // letterSpacing: 0.6,
  },
});
