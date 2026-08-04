/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  BackHandler,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import ApplicationButton from '../../../components/ApplicationButton';
import TransparentHeader from '../../../components/TransparentHeader';

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

/** Mask email for display e.g. "user@gmail.com" -> "u***r@g***.com" */
function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const t = email.trim();
  if (!t) return '';
  const at = t.indexOf('@');
  if (at <= 0 || at === t.length - 1) return t.slice(0, 2) + '***';
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  const localMask = local.length <= 2 ? local + '***' : local[0] + '***' + local[local.length - 1];
  const dot = domain.indexOf('.');
  const domainMask = dot <= 0 ? domain[0] + '***' : domain.slice(0, 1) + '***' + (domain.slice(dot) || '');
  return localMask + '@' + domainMask;
}

export default function Otp({navigation, route}) {
  let emailId = route?.params?.item?.emailId;
  const maskedEmail = maskEmail(emailId);
  let message = route?.params?.item?.message;
  let token = route?.params?.item?.token;
  const [timeLeft, setTimeLeft] = useState(60);
  const [value, setValue] = useState('');
  const [otpErrorMsg, seOtpErrorMsg] = useState('');
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
      const url = API.RESEND_REGISTER_OTP;
      const params = {
        tempUserId: token,
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
      const loginId = route?.params?.item?.username || emailId;
      const params = {
        username: loginId,
        email: loginId,
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
    //  console.log('----',route?.params?.item?.username)
    if (route?.params?.item?.username == undefined) {
      const url = API.VERIFY_OTP;
      const params = {
        otp: value,
        tempUserId: route?.params?.item?.token,
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
      const loginId = route?.params?.item?.username || emailId;
      const url = API.VERIFY_FORGOT_OTP;
      const params = {
        otp: value,
        username: loginId,
        email: loginId,
      };

      postNoAuth(url, params)
        .then(result => {
          if (!result?.error && result?.data?.token) {
            Toast.show(result?.description || 'OTP verified.');
            setIsLoading(false);
            navigation.navigate(NAVIGATION.TO_CHANGE_PASSWORD, {
              item: { token: result.data.token },
            });
          } else if (!result?.error) {
            setIsLoading(false);
            setTitle('Oops!');
            setSubtitle('Invalid response. Please try again.');
            setPopupMessageVisibility(true);
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
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#F5D19A', '#FFFFFF']}
        style={styles.topBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <TransparentHeader
          onBackPress={() => navigation.navigate(NAVIGATION.TO_LOGIN)}
        />
        <View style={styles.headerWrap}>
          <Image source={images.jainSansaarLogo} style={styles.logo} resizeMode="contain" />
          {route?.params?.item?.username !== undefined && (
            <Text style={styles.resetPassword}>{APP_TEXT.RESET_YOUR_PASSWORD}</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.emailTxtView}>
            <Text style={styles.accountCreate}>
              {APP_TEXT.OTP_SENT_TO}
              <Text style={styles.emailHighlight}>{maskedEmail || emailId || ''}</Text>
            </Text>
          </View>

          <View style={styles.otpSection}>
            <View style={styles.codeWrap}>
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
            <Text style={styles.otpValid}>{APP_TEXT.OTP_VALID_FOR}</Text>

            <TouchableOpacity
              disabled={timeLeft !== 0}
              onPress={() => ResendOTP()}
              style={styles.btnResend}
            >
              <Text style={styles.resendLabel}>{APP_TEXT.DIDNT_RECIEVE_OTP}</Text>
              <Text style={styles.resendLink}>{APP_TEXT.RESEND_OTP}</Text>
            </TouchableOpacity>

            <ApplicationButton
              label={APP_TEXT.VERIFY_BUTTON}
              backgroundColor={colors.PRIMARY_BUTTON}
              onButtonPress={() => validation()}
              style={styles.verifyBtn}
            />

            <View style={styles.resendOtpView}>
              <Text style={styles.timerText}>
                {APP_TEXT.YOU_CAN_RESEND_OTP} <Text style={styles.timerNum}>{timeLeft}</Text> {APP_TEXT.SECONDS}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION.TO_LOGIN)}>
                <Text style={styles.backLink}>{APP_TEXT.BACK_TO_LOGIN}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSwipe}>
        <MaterialCommunityIcons name="arrow-up-circle" size={18} color="#000" style={styles.swipeIcon} />
        <Text style={styles.swipeText}>{APP_TEXT.BACK_TO_LOGIN}</Text>
      </View>

      {isLoading && <Loader />}
      {show_alert_msg()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  topBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  scrollContent: { paddingBottom: 120 },
  headerWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  logo: {
    width: 180,
    height: 48,
    marginBottom: 8,
  },
  resetPassword: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: '#FFFF',
    padding: 18,
    marginHorizontal: 0,
  },
  emailTxtView: {
    alignItems: 'center',
    marginBottom: 16,
  },
  accountCreate: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  emailHighlight: {
    color: '#000',
    fontWeight: '600',
  },
  otpSection: { paddingVertical: 8 },
  codeWrap: { alignItems: 'center', marginTop: 8 },
  otpValid: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 4,
  },
  btnResend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  resendLabel: { fontSize: 11, color: '#6B7280' },
  resendLink: { fontSize: 12, color: colors.PRIMARY_BLUE_TEXT, marginLeft: 4 },
  verifyBtn: { alignSelf: 'center', width: '90%', marginTop: 8 },
  resendOtpView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timerText: { fontSize: 11, color: '#6B7280' },
  timerNum: { fontWeight: '600', color: '#000' },
  backLink: { fontSize: 11, color: colors.PRIMARY_BUTTON, fontWeight: '600' },
  bottomSwipe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#F5D19A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIcon: { marginBottom: 6 },
  swipeText: { fontSize: 10, fontWeight: '600', color: '#000' },
  txtInput: { marginTop: 8 },
  CodeFieldRoot: { flexDirection: 'row' },
  otpNumberBoxError: {
    width: 48,
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    fontSize: 18,
    color: '#000',
    lineHeight: 48,
    textAlign: 'center',
    marginHorizontal: 3,
    overflow: 'hidden',
  },
  otpNumberBox: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    fontSize: 18,
    color: '#000',
    lineHeight: 48,
    textAlign: 'center',
    marginHorizontal: 3,
    overflow: 'hidden',
  },
});
