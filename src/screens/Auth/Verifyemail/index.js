import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors, APP_TEXT, NAVIGATION, images } from '../../../global/theme';
import AdminInput from '../../../components/adminInput';
import TransparentHeader from '../../../components/TransparentHeader';
import ApplicationButton from '../../../components/ApplicationButton';
import { API } from '../../../utils/endpoints';
import { postNoAuth } from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';

const INITIALINPUT = {
  username: '',
};

const Verifyemail = ({ navigation }) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const handleChange = (text, field) => {
    setInputs(prev => ({ ...prev, [field]: text }));
    if (field === 'username') {
      if (!text || !text.trim()) {
        setErrors(prev => ({ ...prev, username: 'Email or Username is required' }));
      } else {
        setErrors(prev => ({ ...prev, username: '' }));
      }
    }
  };

  const sendOtp = () => {
    Keyboard.dismiss();
    if (errors.username) return;
    if (!inputs.username || !inputs.username.trim()) {
      setErrors(prev => ({ ...prev, username: 'Email or username is required' }));
      return;
    }

    setIsLoading(true);
    const loginId = inputs.username.trim();
    postNoAuth(API.FORGET_PASSWORD, {
      username: loginId,
      email: loginId,
    })
      .then(res => {
        if (!res?.error) {
          const emailForDisplay =
            res?.data?.maskedEmail ||
            res?.data?.email ||
            loginId;
          navigation.navigate(NAVIGATION.TO_OTP_SCREEN, {
            item: {
              username: loginId,
              emailId: emailForDisplay,
              message: res?.description || res?.data?.message,
            },
          });
        } else {
          setTitle('Oops!');
          setSubtitle(
            res?.description ||
              'Could not send OTP. Please check your email/username and try again.',
          );
          setPopupMessageVisibility(true);
        }
      })
      .catch(err => {
        setTitle('Error');
        setSubtitle(
          err?.description ||
            err?.message ||
            'Something went wrong. Please try again.',
        );
        setPopupMessageVisibility(true);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#F5D19A', '#FFFFFF']}
        style={styles.topBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TransparentHeader />

        <Image source={images.jainSansaarLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email, username, or phone number (with country code, e.g. +91xxxxxxxxxx) and we’ll send you an OTP to reset your password.
          </Text>

          <Text style={styles.fieldLabel}>EMAIL OR USERNAME</Text>
          <AdminInput
            holderName="Email or Username"
            hidePlaceholder
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
            inputMinHeight={48}
            inputVerticalPadding={10}
            inputsty={styles.borderedInput}
          />

          <ApplicationButton
            label="Send OTP"
            backgroundColor={colors.PRIMARY_BUTTON}
            onButtonPress={sendOtp}
            icon="email-send"
            iconSet="MaterialCommunityIcons"
            labelFontSize={14}
            style={styles.sendButton}
          />

          <View style={styles.links}>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate(NAVIGATION.TO_LOGIN)}
            >
              Back to Login
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

      <View style={styles.bottomSwipe}>
        <MaterialCommunityIcons name="arrow-up-circle" size={24} color="#000" style={styles.swipeIcon} />
        <Text style={styles.swipeText}>Remember your password? Back to Login</Text>
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

export default Verifyemail;

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

  scroll: {
    paddingBottom: 120,
  },

  logo: {
    width: 180,
    height: 48,
    alignSelf: 'center',
    marginVertical: 48,
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
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
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
    minHeight: 48,
    height: 48,
    marginTop: 0,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  sendButton: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 20,
  },

  links: {
    marginTop: 16,
    alignItems: 'center',
  },

  link: {
    color: colors.PRIMARY_BUTTON,
    fontWeight: '600',
    fontSize: 14,
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
});
