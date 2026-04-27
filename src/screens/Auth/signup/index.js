import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  BackHandler,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors, APP_TEXT, NAVIGATION, images } from '../../../global/theme';
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
} from '../../../utils/helperfunctions/validations';
import Toast from 'react-native-simple-toast';
import MydatePicker from '../../../components/datePicker';
import { API } from '../../../utils/endpoints';
import { postNoAuth } from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

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
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [warning, setWarning] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameCheckRef = useRef(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const emailCheckRef = useRef(null);

  const debouncedCheckUsername = useCallback((username) => {
    if (usernameCheckRef.current) clearTimeout(usernameCheckRef.current);
    if (!username || !username.trim()) {
      setUsernameStatus(null);
      setCheckingUsername(false);
      return;
    }
    setCheckingUsername(true);
    setUsernameStatus(null);
    usernameCheckRef.current = setTimeout(async () => {
      try {
        const url = API.CHECK_USERNAME(username.trim());
        const res = await axios.get(url);
        const data = res?.data?.data ?? res?.data;
        if (data.available) {
          setUsernameStatus({ available: true, message: 'Username is available' });
          handleError('', 'username');
        } else {
          setUsernameStatus({ available: false, message: data.message || 'Username is already taken' });
          handleError(data.message || 'Username is already taken', 'username');
        }
      } catch {
        setUsernameStatus(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
  }, []);

  const debouncedCheckEmail = useCallback((email) => {
    if (emailCheckRef.current) clearTimeout(emailCheckRef.current);
    if (!email || !email.trim()) {
      setEmailStatus(null);
      setCheckingEmail(false);
      return;
    }
    setCheckingEmail(true);
    setEmailStatus(null);
    emailCheckRef.current = setTimeout(async () => {
      try {
        const url = API.CHECK_EMAIL(email.trim());
        const res = await axios.get(url);
        const data = res?.data?.data ?? res?.data;
        if (data.available) {
          setEmailStatus({ available: true, message: 'Email is available' });
          handleError('', 'emailId');
        } else {
          setEmailStatus({ available: false, message: data.message || 'This email is already registered' });
          handleError(data.message || 'This email is already registered', 'emailId');
        }
      } catch {
        setEmailStatus(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
  }, []);

  const handleSubmitPress = async () => {
    const url = API.REGISTER_USER;
    const params = {
      dateOfBirth: inputs?.DOB,
      email: inputs?.emailId,
      firstName: inputs?.firstName,
      lastName: inputs?.lastName,
      phone: inputs?.mobile,
      countryCode: inputs?.countryCode,
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
          setTitle('Registration failed');
          setWarning(false);
          setSubtitle(
            result?.description ||
              'Something went wrong. Please try again.',
          );
          setPopupMessageVisibility(true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        if (err?.status === 303) {
          setTitle('Warning!');
          setWarning(true);
        } else {
          setTitle('Registration failed');
          setWarning(false);
        }
        const msg =
          err?.message ||
          (typeof err?.response?.data === 'string'
            ? err.response.data
            : null) ||
          (err?.response?.data?.description || err?.response?.data?.message) ||
          'Something went wrong. Please try again.';
        setSubtitle(msg);
        setPopupMessageVisibility(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isEmpty = str => !str || str.trim() === '';

  const validation = () => {
    Keyboard.dismiss();

    if (usernameStatus && !usernameStatus.available) {
      Toast.show('Please choose a different username.');
      return;
    }
    if (checkingUsername) {
      Toast.show('Checking username availability...');
      return;
    }
    if (emailStatus && !emailStatus.available) {
      Toast.show('Please use a different email.');
      return;
    }
    if (checkingEmail) {
      Toast.show('Checking email availability...');
      return;
    }

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
      isEmpty(errors.Terms) &&
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
      if (valid === 'success') {
        handleError('', 'username');
        debouncedCheckUsername(text);
      } else {
        handleError(valid, 'username');
        setUsernameStatus(null);
        setCheckingUsername(false);
      }
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
      if (valid === 'success') {
        handleError('', 'emailId');
        debouncedCheckEmail(text);
      } else {
        handleError(valid, 'emailId');
        setEmailStatus(null);
        setCheckingEmail(false);
      }
    } else if (input === 'mobile') {
      const valid = ValidateMobile(text);
      valid === 'success' ? handleError('', 'mobile') : handleError(valid, 'mobile');
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

  const minDate = new Date();
  const maxDate = new Date();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#F5D19A', '#FFFFFF']}
        style={styles.topBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {loading && <FullScreenLoader visible={loading} />}

      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TransparentHeader />

        <Image source={images.jainSansaarLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.card}>
          <Text style={styles.title}>Create your Account</Text>

          <View style={styles.form}>
            <Text style={styles.fieldLabel}>FIRST NAME</Text>
            <AdminInput
              holderName={APP_TEXT.FIRST_NAME}
              isRequired
              onChangeText={text => handleOnchange(text, 'firstName')}
              error={errors?.firstName}
              value={inputs?.firstName}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
            />
            <View style={styles.gap} />

            <Text style={styles.fieldLabel}>LAST NAME</Text>
            <AdminInput
              isRequired
              holderName={APP_TEXT.LAST_NAME}
              onChangeText={text => handleOnchange(text, 'lastName')}
              error={errors?.lastName}
              value={inputs?.lastName}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
            />
            <View style={styles.gap} />

            <Text style={styles.fieldLabel}>USERNAME</Text>
            <AdminInput
              isRequired
              holderName={APP_TEXT.USER_NAME}
              onChangeText={text => handleOnchange(text, 'username')}
              error={errors?.username}
              value={inputs?.username}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
            />
            {checkingUsername && (
              <View style={styles.usernameStatusRow}>
                <ActivityIndicator size="small" color="#6B7280" />
                <Text style={[styles.usernameStatusText, { color: '#6B7280' }]}>Checking availability...</Text>
              </View>
            )}
            {!checkingUsername && usernameStatus && (
              <View style={styles.usernameStatusRow}>
                <Text style={[styles.usernameStatusText, { color: usernameStatus.available ? '#16a34a' : '#dc2626' }]}>
                  {usernameStatus.message}
                </Text>
              </View>
            )}
            <View style={styles.gap} />

            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <AdminInput
              isRequired
              holderName={APP_TEXT.LOGIN_PASSWORD}
              onChangeText={text => handleOnchange(text, 'password')}
              error={errors?.password}
              password
              value={inputs?.password}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
            />
            <View style={styles.gap} />

            <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
            <AdminInput
              isRequired
              holderName={APP_TEXT.CONFIRM_PASSWORD}
              onChangeText={text => handleOnchange(text, 'confirmPassword')}
              error={errors?.confirmPassword}
              password
              value={inputs?.confirmPassword}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
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

            <Text style={styles.fieldLabel}>EMAIL</Text>
            <AdminInput
              isRequired
              holderName={APP_TEXT.EMAIL}
              onChangeText={text => handleOnchange(text, 'emailId')}
              error={errors?.emailId}
              value={inputs?.emailId}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
            />
            {checkingEmail && (
              <View style={styles.usernameStatusRow}>
                <ActivityIndicator size="small" color="#6B7280" />
                <Text style={[styles.usernameStatusText, { color: '#6B7280' }]}>Checking availability...</Text>
              </View>
            )}
            {!checkingEmail && emailStatus && (
              <View style={styles.usernameStatusRow}>
                <Text style={[styles.usernameStatusText, { color: emailStatus.available ? '#16a34a' : '#dc2626' }]}>
                  {emailStatus.message}
                </Text>
              </View>
            )}
            <View style={styles.gap} />

            <Text style={styles.fieldLabel}>PHONE</Text>
            <AdminInput
              isRequired
              holderName={APP_TEXT.PHONE}
              onChangeText={text => handleOnchange(text, 'mobile')}
              error={errors?.mobile}
              value={inputs?.mobile}
              keyboardType={'numeric'}
              inputBackgroundColor="#FFF"
              inputTextColor="#000"
              placeholderColor="#6B7280"
              inputFontSize={15}
              inputMinHeight={48}
            />

            {/* <View style={[styles.row, { marginTop: 14 }]}>
              <View style={styles.checkboxWrap}>
                <Checkbox
                  isChecked={isCheckedTemple}
                  onClick={() => setIsCheckedTemple(!isCheckedTemple)}
                  checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
                />
              </View>
              <Text style={styles.checkboxText}>{APP_TEXT.REGISTER_AS_TEMPLE}</Text>
            </View> */}

            <View style={styles.termsBlock}>
              <View style={styles.termsRow}>
                <View style={styles.checkboxWrap}>
                  <Checkbox
                    isChecked={isChecked}
                    onClick={() => {
                      setIsChecked(!isChecked);
                      if (errors.Terms) {
                        handleError('', 'Terms');
                      }
                    }}
                    checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
                  />
                </View>
                <Text style={styles.termsTextWrap}>
                  I agree to the{' '}
                  <Text
                    style={styles.termsLink}
                    onPress={() =>
                      navigation.navigate(NAVIGATION.TO_TERMS_OF_SERVICE)
                    }
                  >
                    Terms & Conditions
                  </Text>
                  {' '}and the{' '}
                  <Text
                    style={styles.termsLink}
                    onPress={() =>
                      navigation.navigate(NAVIGATION.TO_PRIVACY_POLICY)
                    }
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>

              {!isChecked && !!errors?.Terms ? (
                <Text style={styles.errorText}>{errors?.Terms}</Text>
              ) : null}
            </View>

            <ApplicationButton
              backgroundColor={colors.PRIMARY_BUTTON}
              label="Get Started"
              onButtonPress={validation}
              icon="account-plus"
              iconSet="MaterialCommunityIcons"
              labelFontSize={14}
              style={styles.signupButton}
            />

          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {isLoading && <Loader />}
      {show_alert_msg()}
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  topBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  logo: {
    width: 180,
    height: 48,
    alignSelf: 'center',
    marginVertical: 24,
  },

  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: '#FFFF',
    padding: 18,
    marginTop: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },

  form: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },

  gap: { height: 10 },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    letterSpacing: 0.4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxWrap: {
    transform: [{ scale: 0.95 }],
    marginLeft: -2,
  },

  checkboxText: {
    marginLeft: 12,
    color: colors.PRIMARY_DARK,
    fontSize: 14,
  },

  termsBlock: {
    marginTop: 16,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  termsTextWrap: {
    marginLeft: 12,
    flex: 1,
    color: colors.PRIMARY_DARK,
    fontSize: 14,
    lineHeight: 20,
  },

  termsLink: {
    color: colors.PRIMARY_BLUE_TEXT,
    textDecorationLine: 'underline',
    fontSize: 14,
  },

  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 4,
  },

  usernameStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
    gap: 6,
  },

  usernameStatusText: {
    fontSize: 13,
    fontWeight: '500',
  },

  signupButton: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 16,
  },

  links: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  linkText: {
    fontSize: 14,
    color: '#000',
  },

  link: {
    color: colors.PRIMARY_BUTTON,
    fontWeight: '600',
    fontSize: 14,
  },
});
