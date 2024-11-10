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
    username: '',
  };
  
  const SuccessScreen = ({navigation}) => {
    const [inputs, setInputs] = useState(INITIALINPUT);
    const [errors, setErrors] = useState(INITIALINPUT);
    const [isLoading, setIsLoading] = useState(false);
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
      }
      setInputs(prevState => ({...prevState, [input]: text}));
    };
  
    const handleError = (error, input) => {
      setErrors(prevState => ({...prevState, [input]: error}));
    };
  
    const feedbackformRedirect = () => {
      navigation.navigate(NAVIGATION.TO_OTP_SCREEN);
    };
  
    const BeneficiaryformRedirect = () => {
      Linking.openURL(beneficiaryRegistration);
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
      const url = API.FORGET_PASSWORD;
      const params = {
        username: inputs?.username,
      };
      setIsLoading(true);
      postNoAuth(url, params)
        .then(result => {
          if (!result?.error) {
            // console.log('LOGIN_AUTH response then----if--', result);
            setIsLoading(false);
            setTitle('OTP send successfully!');
            setWarning(false);
            setSubtitle(result?.data?.message);
            setPopupMessageVisibility(true);
            setWarning(false);
            onLogin();
            const data = {
              emailId: inputs?.username,
              message: result?.data?.message,
              token: result?.data?.token,
              username:inputs?.username,
            };
            // console.log('LOGIN_AUTH response then--else-----', data);
            navigation.navigate(NAVIGATION.TO_OTP_SCREEN, {item: data});
          } else {
           // console.log('LOGIN_AUTH response then--else-----', result);
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
            {/* <View
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
            </View> */}

            <Image
        source={images.Success}
        style={{
          width: 200,
          height: 200,
          alignSelf: 'center',
         marginTop: 4,
        }}
      />
        <View
              style={{
                width: '100%',
                paddingVertical: 30,
                alignItems: 'center',
                marginTop:-40
              }}>
              <Text
                style={{
                  color: '#006400',
                  lineHeight: 19.1,
                  padding: 5,
                  fontSize:24,
                  textAlign: 'center',
                  fontWeight:'bold'
                }}>
                {APP_TEXT.SUCCESS}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                paddingVertical: 30,
                alignItems: 'center',
                marginTop:-40
              }}>
              <Text
                style={{
                  color: '#006400',
                  lineHeight: 19.1,
                  padding: 5,
                  fontSize:20,
                  textAlign: 'center',
                //   fontWeight:'bold'
                }}>
                {APP_TEXT.PASSWORD_CHANGED}
              </Text>
            </View>
            <View style={[st.cardsty, st.shadowProp]}>

           
              {/* <View
                style={
                  {
                    // backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
                    // opacity: 0.6,
                    // borderRadius: 6,
                  }
                }>
                <AdminInput
                  placeholder={APP_TEXT.LOGIN_USERNAME}
                  onChangeText={text => handleOnchange(text, 'username')}
                  onFocus={() => handleError(null, 'username')}
                  error={errors?.username}
                  iconName={''}
                  label={''}
                  // keyboardType={'numeric'}
                />
              </View> */}
  
              {/* <View style={[st.mt_B10]}>
                <ApplicationButton
                  backgroundColor={ colors.PRIMARY_BUTTON}
                  label={APP_TEXT.SEND_OTP}
                  onButtonPress={() => {
                    validation();
                  }}
                />
              </View> */}
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
  
  export default SuccessScreen;
  
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
  