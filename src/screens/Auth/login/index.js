import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  SafeAreaView,
  Image,
  PanResponder,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors, APP_TEXT, NAVIGATION, images } from '../../../global/theme';
import AdminInput from '../../../components/adminInput';
import TransparentHeader from '../../../components/TransparentHeader';
import ApplicationButton from '../../../components/ApplicationButton';
import Checkbox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ValidatePassword,
} from '../../../utils/helperfunctions/validations';
import { setLogin } from '../../../redux/reducers/Login';
import { storeTokenData } from '../../../utils/apicalls/tokenApi';
import { API } from '../../../utils/endpoints';
import { setLogindata } from '../../../redux/reducers/Logindata';
import { postNoAuth } from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
import { useDispatch } from 'react-redux';

const INITIALINPUT = {
  username: '',
  password: '',
};

const Login = ({ navigation }) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const dispatch = useDispatch();

  const swipeUpToRegister = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 15,
        onPanResponderRelease: (_, { dy, dx }) => {
          const isSwipeUp = dy < -30;
          const isTap = Math.abs(dx) < 15 && Math.abs(dy) < 15;
          if (isSwipeUp || isTap) {
            navigation.navigate(NAVIGATION.TO_SIGNUP);
          }
        },
      }),
    [navigation],
  );

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    const u = await AsyncStorage.getItem('username');
    const p = await AsyncStorage.getItem('password');
    if (u && p) {
      setInputs({ username: u, password: p });
      setIsChecked(true);
    }
  };

  const isValidEmailShape = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());

  const handleChange = (text, field) => {
    setInputs(prev => ({ ...prev, [field]: text }));

    if (field === 'username') {
      const t = (text || '').trim();
      if (!t) {
        setErrors(prev => ({ ...prev, username: 'Email or username is required' }));
      } else if (t.includes('@') && !isValidEmailShape(t)) {
        setErrors(prev => ({ ...prev, username: 'Enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, username: '' }));
      }
    }

    if (field === 'password') {
      const v = ValidatePassword(text);
      setErrors(prev => ({ ...prev, password: v === 'success' ? '' : v }));
    }
  };

  const onLogin = async () => {
    const loginId = (inputs.username || '').trim();
    if (!loginId) {
      setErrors(prev => ({ ...prev, username: 'Email or username is required' }));
      return;
    }
    if (loginId.includes('@') && !isValidEmailShape(loginId)) {
      setErrors(prev => ({ ...prev, username: 'Enter a valid email address' }));
      return;
    }
    if (errors.password) return;

    if (isChecked) {
      await AsyncStorage.setItem('username', loginId);
      await AsyncStorage.setItem('password', inputs.password);
    }

    setIsLoading(true);
    const invalidCredentialsMessage =
      'Email/username and password did not match. Please try again.';

    postNoAuth(API.LOGIN_AUTH, {
      username: loginId,
      password: inputs.password,
      mode: 'Mobile',
    })
      .then(res => {
        if (!res?.error) {
          storeTokenData(res?.data?.token);
          dispatch(setLogindata(res?.data));
          dispatch(setLogin(true));
        } else {
          setTitle('Login failed');
          setSubtitle(res?.description || invalidCredentialsMessage);
          setPopupMessageVisibility(true);
        }
      })
      .catch(err => {
        const isAuthFailure = err?.status === 401 || err?.status === 403;
        setTitle('Login failed');
        setSubtitle(
          isAuthFailure ? invalidCredentialsMessage : (err?.message || 'Something went wrong. Please try again.')
        );
        setPopupMessageVisibility(true);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Cream to White Gradient Header */}
      <LinearGradient
        colors={['#F5D19A', '#FFFFFF']}
        style={styles.topBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <TransparentHeader />

        {/* App Logo */}
        <Image source={images.jainSansaarLogo} style={styles.logo} resizeMode="contain" />

        {/* White Sheet */}
        <View style={styles.card}>
          <Text style={styles.title}>Log In to your Account</Text>
          <Text style={styles.fieldLabel}>EMAIL OR USERNAME</Text>
          <AdminInput
            holderName="Email or username"
            isRequired
            value={inputs.username}
            error={errors.username}
            onChangeText={t => handleChange(t, 'username')}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            inputBackgroundColor="#FFF"
            inputTextColor="#000"
            placeholderColor="#6B7280"
            inputFontSize={15}
            inputMinHeight={44}
            inputsty={styles.borderedInput}
          />

          <View style={styles.gap} />
          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <AdminInput
            holderName="Password"
            isRequired
            password
            value={inputs.password}
            error={errors.password}
            onChangeText={t => handleChange(t, 'password')}
            inputBackgroundColor="#FFF"
            inputTextColor="#000"
            placeholderColor="#6B7280"
            inputFontSize={15}
            inputMinHeight={44}
            inputsty={styles.borderedInput}
          />

          {/* Remember me */}
          <View style={styles.row}>
            <View style={styles.checkboxWrap}>
              <Checkbox
                isChecked={isChecked}
                onClick={() => setIsChecked(!isChecked)}
                checkedCheckBoxColor={colors.PRIMARY_BLUE_TEXT}
              />
            </View>
            <Text style={styles.remember}>Remember me?</Text>
          </View>

          <ApplicationButton
            label="Login"
            backgroundColor={colors.PRIMARY_BUTTON}
            onButtonPress={onLogin}
            icon="login"
            iconSet="MaterialCommunityIcons"
            labelFontSize={14}
            style={styles.loginButton}
          />

          {/* Links */}
          <View style={styles.links}>
            <Text style={styles.linkText}>
              Don’t have an account?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate(NAVIGATION.TO_SIGNUP)}
              >
                Sign Up
              </Text>
            </Text>

            <Text
              style={styles.link}
              onPress={() => navigation.navigate(NAVIGATION.TO_FORGET_PASSWORD)}
            >
              Forgot Password
            </Text>
          </View>

          <View style={styles.legalRow}>
            <Text
              style={styles.legalLink}
              onPress={() => navigation.navigate(NAVIGATION.TO_PRIVACY_POLICY)}
            >
              Privacy Policy
            </Text>
            <Text style={styles.legalSep}>·</Text>
            <Text
              style={styles.legalLink}
              onPress={() => navigation.navigate(NAVIGATION.TO_TERMS_OF_SERVICE)}
            >
              Terms & Conditions
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Swipe Section - swipe up or tap to go to Register */}
      <View style={styles.bottomSwipe} {...swipeUpToRegister.panHandlers}>
        <MaterialCommunityIcons name="arrow-up-circle" size={24} color="#000" style={styles.swipeIcon} />
        <Text style={styles.swipeText}>New User? Swipe Up</Text>
      </View>

      {isLoading && <Loader />}
      <PopUpMessage
        display={popupMessageVisibility}
        titleMsg={title}
        subTitle={subtitle}
        onModalClick={() => setPopupMessageVisibility(false)}
      />
    </SafeAreaView>
  );
};

export default Login;
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
    backgroundColor: '#F5D19A',
  },

  scroll: {
    paddingBottom: 160,
  },

  logo: {
    width: 180,
    height: 48,
    alignSelf: 'center',
    marginVertical: 60,
  },

  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: '#FFFF',
    padding: 18,
    marginTop: 28,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#000',
    textAlign: 'center',
  },

  gap: {
    height: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },

  remember: {
    marginLeft: 12,
    fontSize: 14,
    color: '#000',
  },

  loginButton: {
    alignSelf: 'center',
    width: '90%',
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    letterSpacing: 0.4,
  },

  borderedInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    minHeight: 44,
    height: 44,
    marginTop: 0,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  links: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  legalRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  legalLink: {
    color: colors.PRIMARY_BUTTON,
    fontWeight: '600',
    fontSize: 13,
  },

  legalSep: {
    marginHorizontal: 8,
    fontSize: 13,
    color: '#6B7280',
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

  swipeIcon: {
    marginBottom: 6,
  },

  swipeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  checkboxWrap: {
    transform: [{ scale: 0.95 }],
    marginLeft: -2,
  },
});
