import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Keyboard,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { colors, APP_TEXT, NAVIGATION } from '../../../global/theme';
import AdminInput from '../../../components/adminInput';
import TransparentHeader from '../../../components/TransparentHeader';
import FullScreenLoader from '../../../components/FullScreenLoader';
import ApplicationButton from '../../../components/ApplicationButton';
import Checkbox from 'react-native-check-box';
import {
  ValidatePassword,
  ValidateUserName,
  ValidatefirstName,
  ValidatelastName,
  ValidateMail,
  ValidateMobile,
  ValidateCVV,
  ValidateTempleName,
} from '../../../utils/helperfunctions/validations';
import Toast from 'react-native-simple-toast';
import MydatePicker from '../../../components/datePicker';
import { API } from '../../../utils/endpoints';
import { postNoAuth } from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
import useNetworkStatus from '../../../hooks/networkStatus';
import { useFocusEffect } from '@react-navigation/native';
import { historyDownload } from '../../../utils/helperfunctions/functions';

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
  templeName: '',
};

const Signup = ({ navigation }) => {
  const [errors, setErrors] = useState(INITIALINPUT);
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTemple, setIsCheckedTemple] = useState(false);
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
      email: inputs?.emailId,
      firstName: inputs?.firstName,
      lastName: inputs?.lastName,
      phone: inputs?.mobile,
      password: inputs?.password,
      username: inputs?.username,
      isTempleMember: isCheckedTemple,
    };

    setIsLoading(true);
    postNoAuth(url, params)
      .then(result => {
        if (!result?.error) {
          setIsLoading(false);
          const data = {
            emailId: inputs?.emailId,
            token: result?.data?.token,
          };
          navigation.navigate(NAVIGATION.TO_OTP_SCREEN, { item: data });
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
  };

  const isEmpty = str => !str || str.trim() === '';

  const validation = () => {
    Keyboard.dismiss();

    if (!isChecked) {
      handleError('You must agree to the Terms and Conditions to proceed', 'Terms');
    }

    if (isEmpty(inputs.username)) handleError(ValidateUserName(null), 'username');
    if (isEmpty(inputs.password)) handleError(ValidatePassword(null), 'password');
    if (isEmpty(inputs.confirmPassword))
      handleError(ValidatePassword(null), 'confirmPassword');
    if (isEmpty(inputs.firstName)) handleError(ValidatefirstName(null), 'firstName');
    if (isEmpty(inputs.lastName)) handleError(ValidatelastName(null), 'lastName');
    if (isEmpty(inputs.emailId)) handleError(ValidateMail(null), 'emailId');
    if (isEmpty(inputs.mobile)) handleError(ValidateMobile(null), 'mobile');

    if (isEmpty(inputs.templeName) && isCheckedTemple) {
      handleError(ValidateTempleName(null), 'templeName');
    }

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
      isChecked === true
    ) {
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
    if (input === 'username') {
      const valid = ValidateUserName(text);
      valid === 'success' ? handleError('', 'username') : handleError(valid, 'username');
    } else if (input === 'password') {
      const valid = ValidatePassword(text);
      valid === 'success' ? handleError('', 'password') : handleError(valid, 'password');
    } else if (input === 'confirmPassword') {
      if (inputs.password !== text) {
        handleError(
          'The passwords do not match. Please ensure both password fields are identical',
          'confirmPassword',
        );
      } else {
        handleError('', 'confirmPassword');
      }
    } else if (input === 'firstName') {
      const valid = ValidatefirstName(text);
      valid === 'success' ? handleError('', 'firstName') : handleError(valid, 'firstName');
    } else if (input === 'lastName') {
      const valid = ValidatelastName(text);
      valid === 'success' ? handleError('', 'lastName') : handleError(valid, 'lastName');
    } else if (input === 'emailId') {
      const valid = ValidateMail(text);
      valid === 'success' ? handleError('', 'emailId') : handleError(valid, 'emailId');
    } else if (input === 'mobile') {
      const valid = ValidateMobile(text);
      valid === 'success' ? handleError('', 'mobile') : handleError(valid, 'mobile');
    } else if (input === 'templeName') {
      const valid = ValidateTempleName(text);
      valid === 'success'
        ? handleError('', 'templeName')
        : handleError(valid, 'templeName');
    } else if (input === 'CVV') {
      const valid = ValidateCVV(text);
      valid === 'success' ? handleError('', 'CVV') : handleError(valid, 'CVV');
    }

    setInputs(prev => ({ ...prev, [input]: text }));
  };

  const handlechange = text => {
    setInputs(prev => ({ ...prev, DOB: text.toISOString() }));
  };

  const handleError = (error, input) => {
    setErrors(prev => ({ ...prev, [input]: error }));
  };

  const onPopupMessageModalClick = value => {
    if (warning === true) {
      handleSubmitPress();
      setPopupMessageVisibility(value);
    } else {
      setPopupMessageVisibility(value);
    }
  };

  const show_alert_msg = () => {
    return (
      <PopUpMessage
        display={popupMessageVisibility}
        titleMsg={title}
        subTitle={subtitle}
        onModalClick={val => onPopupMessageModalClick(val)}
        twoButton={warning ? true : false}
        onPressNoBtn={() => {
          setWarning(false);
          setPopupMessageVisibility(false);
        }}
      />
    );
  };

  const getpdfFile = async (pdfTitle, url) => {
    if (!isConnected) {
      onPopupMessageModalClick(true);
      setTitle('No Internet Connection');
      setSubtitle('Please check your Wi-Fi or mobile network connection and try again.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await historyDownload(pdfTitle, url);
      if (result) {
        Toast.show('Terms and Condition has been downloaded successfully');
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = new Date();
  const maxDate = new Date();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top cream section like Figma */}
      <View style={styles.topBg} />

      {loading && <FullScreenLoader visible={loading} />}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TransparentHeader />

        {/* White rounded card like screenshot */}
        <View style={styles.card}>
          <Text style={styles.title}>Create your Account</Text>

          <View style={styles.form}>
            <AdminInput
              holderName={APP_TEXT.FIRST_NAME}
              isRequired
              onChangeText={text => handleOnchange(text, 'firstName')}
              error={errors?.firstName}
              value={inputs?.firstName}
              iconName={''}
              label={''}
            />
            <View style={styles.gap} />

            <AdminInput
              isRequired
              holderName={APP_TEXT.LAST_NAME}
              onChangeText={text => handleOnchange(text, 'lastName')}
              error={errors?.lastName}
              value={inputs?.lastName}
              iconName={''}
              label={''}
            />
            <View style={styles.gap} />

            <AdminInput
              isRequired
              holderName={APP_TEXT.USER_NAME}
              onChangeText={text => handleOnchange(text, 'username')}
              error={errors?.username}
              value={inputs?.username}
              iconName={''}
              label={''}
            />
            <View style={styles.gap} />

            <AdminInput
              isRequired
              holderName={APP_TEXT.LOGIN_PASSWORD}
              onChangeText={text => handleOnchange(text, 'password')}
              error={errors?.password}
              password
              label={''}
              value={inputs?.password}
            />
            <View style={styles.gap} />

            <AdminInput
              isRequired
              holderName={APP_TEXT.CONFIRM_PASSWORD}
              onChangeText={text => handleOnchange(text, 'confirmPassword')}
              error={errors?.confirmPassword}
              password
              label={''}
              value={inputs?.confirmPassword}
            />
            <View style={styles.gap} />

            <MydatePicker
              disabled={disabled}
              handleChange={handlechange}
              minDate={minDate}
              selectedValue={inputs?.DOB}
              maxDate={maxDate}
              renderType={'Date of Birth'}
            />
            <View style={styles.gap} />

            <AdminInput
              isRequired
              holderName={APP_TEXT.EMAIL}
              onChangeText={text => handleOnchange(text, 'emailId')}
              error={errors?.emailId}
              value={inputs?.emailId}
              iconName={''}
              label={''}
            />
            <View style={styles.gap} />

            <AdminInput
              isRequired
              holderName={APP_TEXT.PHONE}
              onChangeText={text => handleOnchange(text, 'mobile')}
              error={errors?.mobile}
              value={inputs?.mobile}
              iconName={''}
              label={''}
              keyboardType={'numeric'}
            />

            {/* Keep your existing extras (remove if not needed) */}
            <View style={[styles.row, { marginTop: 14 }]}>
              <Checkbox
                isChecked={isCheckedTemple}
                error={errors?.Terms}
                onClick={() => setIsCheckedTemple(!isCheckedTemple)}
                checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
              />
              <Text style={styles.checkboxText}>{APP_TEXT.REGISTER_AS_TEMPLE}</Text>
            </View>

            {isCheckedTemple ? (
              <>
                <View style={styles.gap} />
                <AdminInput
                  isRequired
                  holderName={APP_TEXT.TEMPLE_NAME}
                  onChangeText={text => handleOnchange(text, 'templeName')}
                  error={errors?.templeName}
                  value={inputs?.templeName}
                  iconName={''}
                  label={''}
                />
              </>
            ) : null}

            <View style={{ marginTop: 16 }}>
              <Pressable
                onPress={() =>
                  getpdfFile(
                    'terms and condition',
                    'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
                  )
                }
              >
                <View style={styles.row}>
                  <Checkbox
                    isChecked={isChecked}
                    error={errors?.Terms}
                    onClick={() => setIsChecked(!isChecked)}
                    checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
                  />

                  <Text style={styles.termsText}>
                    {APP_TEXT.AGREEING_TO}{' '}
                    <Text style={styles.termsLink}>{APP_TEXT.TERMS_AND_CONDITION}</Text>
                  </Text>
                </View>
              </Pressable>

              {!isChecked && !!errors?.Terms ? (
                <Text style={styles.errorText}>{errors?.Terms}</Text>
              ) : null}
            </View>

            <Pressable
              onPress={() => navigation.navigate(NAVIGATION.TO_LOGIN)}
              style={styles.alreadyAcc}
            >
              <Text style={styles.accountCreate}>{APP_TEXT.ALREADY_HAVE_ACCOUNT}</Text>
              <Text style={styles.loginLink}>{APP_TEXT.LOGIN_LOGIN}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomBtnWrap}>
        <ApplicationButton
          backgroundColor={colors.PRIMARY_BUTTON}
          label={'GET STARTED'}
          onButtonPress={validation}
        />
      </View>

      {isLoading && <Loader />}
      {show_alert_msg()}
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    backgroundColor: '#F5D19A', // cream like screenshot
  },

  scrollContent: {
    paddingBottom: 10, // space for fixed button
  },

  card: {
    marginTop: 30,
 //   marginHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    paddingTop: 22,
    // paddingHorizontal: 18,
  //  paddingBottom: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B1B3A',
    textAlign: 'center',
    marginBottom: 16,
  },

  form: { paddingTop: 6 ,padding:35},

  gap: { height: 14 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxText: {
    marginLeft: 8,
    color: colors.PRIMARY_DARK,
    fontSize: 13,
  },

  termsText: {
    marginLeft: 8,
    color: colors.PRIMARY_DARK,
    fontSize: 12,
    flex: 1,
  },

  termsLink: {
    color: colors.PRIMARY_BLUE_TEXT,
    textDecorationLine: 'underline',
    fontSize: 12,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },

  bottomBtnWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
  },

  alreadyAcc: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  accountCreate: {
    fontSize: 14,
    color: colors.PRIMARY_DARK,
    fontWeight: '400',
  },

  loginLink: {
    fontSize: 14,
    color: colors.PRIMARY_BLUE_TEXT,
    marginLeft: 6,
    fontWeight: '600',
  },
});
