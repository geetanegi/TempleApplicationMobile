import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  BackHandler,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {useDispatch, useSelector} from 'react-redux';
import LoginImg from '../../../components/loginImage';
import {View} from 'react-native-animatable';
import useNetworkStatus from '../../../hooks/networkStatus';
import ApplicationButton from '../../../components/ApplicationButton';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {API} from '../../../utils/endpoints';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import Toast from 'react-native-simple-toast';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
const CELL_COUNT = 6;
export default function Otp({navigation, route}) {
  let emailId = route?.params?.item?.emailId;
  let message = route?.params?.item?.message;
  let token = route?.params?.item?.token;
  const isConnected = useNetworkStatus();
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(60);
  const [value, setValue] = useState('');
  const [otpErrorMsg, seOtpErrorMsg] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [warning, setWarning] = useState(false);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {}, []);

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

  const ResendOTP = async () => {
    if (route?.params?.item?.username === undefined) {
      const url = API.FORGET_REGISTER_USER_PASSWORD;
      const params = {
        tempUserId: token,
        mode:'Mobile'
      };
      setIsLoading(true);
      postNoAuth(url, params)
        .then(result => {
          if (!result?.error) {
            setIsLoading(false);
            setTitle('OTP send successfully!');
            setWarning(false);
            setSubtitle(result?.data?.message);
            setPopupMessageVisibility(true);
            setWarning(false);
          } else {
            setIsLoading(false);

            setTitle('Oops!');
            setWarning(false);

            setSubtitle(result?.description);
            setPopupMessageVisibility(true);
          }
        })
        .catch(err => {
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
          setIsLoading(false);
        });
    } else {
      const url = API.FORGET_PASSWORD;
      const params = {
        username: emailId,
      };
      setIsLoading(true);
      postNoAuth(url, params)
        .then(result => {
          if (!result?.error) {
            setIsLoading(false);
            setTitle('OTP send successfully!');
            setWarning(false);
            setSubtitle(result?.data?.message);
            setPopupMessageVisibility(true);
            setWarning(false);
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
    }
  };
  const validation = async () => {
    Keyboard.dismiss();
    console.log('----',route?.params?.item?.username)
    if (route?.params?.item?.username == undefined) {
      console.log('------------')
      const url = API.VERIFY_OTP;
      const params = {
        otp: value,
        tempUserId: route?.params?.item?.token,
        mode:'Mobile'
      };
      postNoAuth(url, params)
        .then(result => {
          if (!result?.error) {
            Toast.show(result?.data?.message);
            navigation.navigate(NAVIGATION.TO_LOGIN);
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
    } else {
   //   console.log('-----url--------------------',route?.params?.item?.message);
      const url = API.VERIFY_LOGIN_OTP;
      const params = {
        otp: value,
        username:route?.params?.item?.username ,
        mode:'Mobile'
      };

      postNoAuth(url, params)
        .then(result => {
          if (!result?.error) {
            Toast.show(result?.data?.message);
            setIsLoading(false);
            navigation.navigate(NAVIGATION.TO_CHANGE_PASSWORD, {
              item: result.data,
            });
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

  return (
    <ImageBackground style={{flex: 1}} source={images.loginBG}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={[st.card, st.mt_t300, styles.container]}>
          {/* <LoginImg /> */}
          {route?.params?.item?.username !== undefined && (
            <View style={styles.resetPWD}>
              <Text style={styles.resetPassword}>
                {APP_TEXT.RESET_YOUR_PASSWORD}
              </Text>
            </View>
          )}

          <View style={styles.emailTxtView}>
            <Text
              style={[
                styles.accountCreate,
                {color: colors.PRIMARY_SMALL_TEXT},
              ]}>
              {APP_TEXT.OTP_SENT_TO}
              <Text
                style={[
                  styles.txtForgotPwd,
                  {color: colors.PRIMARY_SOLID_TEXT, fontWeight: 600},
                ]}>
                {emailId}
              </Text>
            </Text>
          </View>

          <View style={[st.cardsty, st.shadowProp]}>
            <View style={st.center}>
            <View style={styles.txtInput}>
              <CodeField
                ref={ref}
                {...props}
                caretHidden={false}
                value={value}
                onChangeText={text => {
                  setValue(text.replace(/[^0-9]/g, ''));
                }}
                cellCount={CELL_COUNT}
                autoFocus={true}
                rootStyle={styles.CodeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={
                      otpErrorMsg
                        ? styles.otpNumberBoxError
                        : styles.otpNumberBox
                    }
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            </View>
            <View style={styles.otpValid}>
              <Text
                style={[styles.accountCreate, {color: colors.PRIMARY_DARK}]}>
                {APP_TEXT.OTP_VALID_FOR}
              </Text>
            </View>

            <TouchableOpacity
              disabled={timeLeft != 0}
              onPress={() => ResendOTP()}
              style={styles.btnResend}>
              <Text
                style={[
                  styles.accountCreate,
                  {color: colors.PRIMARY_LIGHT_TEXT},
                ]}>
                {APP_TEXT.DIDNT_RECIEVE_OTP}
              </Text>
              <Text
                style={[
                  styles.txtForgotPwd,
                  {color: colors.PRIMARY_BLUE_TEXT, fontSize: 12},
                ]}>
                {APP_TEXT.RESEND_OTP}
              </Text>
            </TouchableOpacity>

            <ApplicationButton
              label={APP_TEXT.VERIFY_BUTTON}
              backgroundColor={colors.PRIMARY_BUTTON}
              onButtonPress={() => {
                validation();
              }}
            />

            <View style={styles.resendOtpView}>
              <Text
                style={[
                  styles.accountCreate,
                  {color: colors.PRIMARY_LIGHT_TEXT},
                ]}>
                {APP_TEXT.YOU_CAN_RESEND_OTP} {''}
                <Text
                  style={[
                    styles.accountCreate,
                    {color: colors.PRIMARY_DARK, fontWeight: 600},
                  ]}>
                  {timeLeft}
                </Text>{' '}
                {APP_TEXT.SECONDS}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(NAVIGATION.TO_LOGIN);
                }}>
                <Text
                  style={[
                    styles.txtForgotPwd,
                    {color: colors.PRIMARY_BLUE_TEXT},
                  ]}>
                  {APP_TEXT.BACK_TO_LOGIN}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
      {show_alert_msg()}
    </ImageBackground>
  );
}

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
  accountCreate: {
    fontSize: 12,
    color: colors.black,
    textAlign: 'justify',
    fontWeight: 400,
  },
  txtForgotPwd: {
    fontSize: 14,
    color: colors.PRIMARY_BLUE_TEXT,
    textAlign: 'justify',
  },
  resendOtpView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  btnResend: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  otpValid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  txtInput: {
    // backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
    // opacity: 0.6,
    // borderRadius: 6,
    marginTop: 20,
    // marginleft: 20,
  },
  emailTxtView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:40
  },
  resetPassword: {
    color: colors.PRIMARY_DARK,
    lineHeight: 19.1,
    padding: 5,
    fontSize: 24,
    color: colors.PRIMARY_DARK,
    textAlign: 'center',
  },
  resetPWD: {
    width: '100%',
    paddingVertical: 15,
  },
  CodeFieldRoot: {
    flexDirection: 'row',
  },
  otpNumberBoxError: {
    width: 48,
    height: 48,
    backgroundColor: 'red',
    borderRadius: 6,
    fontSize: 14,
    color: 'blue',
    lineHeight: 48,
    textAlign: 'center',
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  otpNumberBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
    opacity: 0.6,
    borderRadius: 6,
    fontSize: 14,
    color: '#FFF',
    lineHeight: 48,
    textAlign: 'center',
    marginHorizontal: 2,
    overflow: 'hidden',
  },
});
