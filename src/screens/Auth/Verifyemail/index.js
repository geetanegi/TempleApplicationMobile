import {
  StyleSheet,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {useDispatch} from 'react-redux';
import LoginImg from '../../../components/loginImage';
import {API} from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import {ValidateUserName} from '../../../utils/helperfunctions/validations';
import {View} from 'react-native-animatable';
import AdminInput from '../../../components/adminInput';
import ApplicationButton from '../../../components/ApplicationButton';
import DeviceInfo from 'react-native-device-info';
import PopUpMessage from '../../../components/popup';
import {requestLocationPermission} from '../../../utils/helperfunctions/location';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import useNetworkStatus from '../../../hooks/networkStatus';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const INITIALINPUT = {
  username: '',
};

const Verifyemail = ({navigation}) => {
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
    if (input == 'username') {
      const validNumber = ValidateUserName(text);
      let isValid = true;
      if (validNumber != 'success') {
        handleError(validNumber, 'username');
        isValid = false;
      } else {
        handleError('', 'username');
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
    const url = API.FORGET_PASSWORD;
    const params = {
      username: inputs?.username,
      mode:"MOBILE"

    };
    setIsLoading(true);
    postNoAuth(url, params)
      .then(result => {
        if (!result?.error) {
          setIsLoading(false);
          console.log('----------result',result?.data)
          const data = {
            emailId: result?.data?.maskedEmail,
            message: result?.data?.message,
            token: result?.data?.token,
            username:inputs?.username
          };
          Toast.show(result?.data?.message);
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

  const validation = async () => {
    Keyboard.dismiss();
    const validNumber = ValidateUserName(inputs?.username);
    let isValid = true;
    if (validNumber != 'success') {
      handleError(validNumber, 'username');
      isValid = false;
    } else {
      handleError('', 'username');
    }
    if (isValid) {
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
            }}>
            <Text
              style={{
                color: colors.PRIMARY_DARK,
                lineHeight: 19.1,
                padding: 5,
                fontSize: 24,
                textAlign: 'center',
              }}>
              {APP_TEXT.RESET_PASSWORD}
            </Text>
          </View>
          <View style={[st.cardsty, st.shadowProp]}>
            <View
              style={
                {
                  // backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
                  // opacity: 0.6,
                  // borderRadius: 6,
                }
              }>
              <AdminInput
                    isRequired
                    holderName={APP_TEXT.LOGIN_USERNAME}
                    onChangeText={text => {
                      handleOnchange(text, 'username');
                    }}
                    onFocus={() => handleError(null, 'username')}
                    error={errors?.username}
                    value={inputs?.username}
                    iconName={''}
                    label={''}
                // keyboardType={'numeric'}
              />
            </View>

            <View style={[st.mt_B10]}>
              <ApplicationButton
                backgroundColor={colors.PRIMARY_BUTTON}
                label={APP_TEXT.SEND_OTP}
                onButtonPress={() => {
                 // navigation.navigate(NAVIGATION.TO_OTP_SCREEN)
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
                    color: colors.blue,
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

export default Verifyemail;

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
