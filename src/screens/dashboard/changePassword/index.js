import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {API} from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import {ValidatePassword} from '../../../utils/helperfunctions/validations';
import AdminInput from '../../../components/adminInput';
import ApplicationButton from '../../../components/ApplicationButton';
import Toast from 'react-native-simple-toast';
import PopUpMessage from '../../../components/popup';
import {postNoAuth} from '../../../utils/apicalls/postApi';
import TransparentHeader from '../../../components/TransparentHeader';

const INITIALINPUT = {
  password: '',
  confirmPassword: '',
};

const ChangePassword = ({navigation, route}) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [warning, setWarning] = useState(false);

  const handleOnchange = (text, input) => {
    if (input === 'password') {
      const validPassword = ValidatePassword(text);
      handleError(validPassword === 'success' ? '' : validPassword, 'password');
    } else if (input === 'confirmPassword') {
      if (inputs.password !== text) {
        handleError(
          'The passwords do not match. Please ensure both password fields are identical',
          'confirmPassword',
        );
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
    if (successPopupVisible) {
      setPopupMessageVisibility(false);
      setSuccessPopupVisible(false);
      navigation.navigate(NAVIGATION.TO_LOGIN);
      return;
    }
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
    const resetToken = route?.params?.item?.token;
    if (!resetToken) {
      setTitle('Error');
      setSubtitle('Invalid session. Please request a new OTP.');
      setPopupMessageVisibility(true);
      return;
    }
    const url = API.RESET_PASSWORD;
    const params = {
      password: inputs?.password,
      token: resetToken,
    };
    setIsLoading(true);
    postNoAuth(url, params)
      .then(result => {
        if (!result?.error) {
          setIsLoading(false);
          setTitle('Success');
          setSubtitle(result?.description || result?.data?.message || 'Password changed successfully. You can now log in.');
          setSuccessPopupVisible(true);
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
  };


  const isEmpty = str => {
    return !str || str.trim() === '';
  };

  const validation = async () => {
   // console.log('----calasd', inputs);
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
        <Image source={images.jainSansaarLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.card}>
          <Text style={styles.title}>{APP_TEXT.RESET_YOUR_PASSWORD}</Text>
          <Text style={styles.subtitle}>Enter your new password below.</Text>

          <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
          <AdminInput
            isRequired
            holderName={APP_TEXT.LOGIN_PASSWORD}
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            error={errors?.password}
            value={inputs?.password}
            password
            inputBackgroundColor="#FFF"
            inputTextColor="#000"
            placeholderColor="#6B7280"
            inputFontSize={12}
            inputMinHeight={48}
          />
          <View style={styles.gap} />
          <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
          <AdminInput
            isRequired
            holderName={APP_TEXT.CONFIRM_PASSWORD}
            onChangeText={text => handleOnchange(text, 'confirmPassword')}
            onFocus={() => handleError(null, 'confirmPassword')}
            error={errors?.confirmPassword}
            value={inputs?.confirmPassword}
            password
            inputBackgroundColor="#FFF"
            inputTextColor="#000"
            placeholderColor="#6B7280"
            inputFontSize={12}
            inputMinHeight={48}
          />

          <ApplicationButton
            backgroundColor={colors.PRIMARY_BUTTON}
            label={APP_TEXT.RESET_BUTTON}
            onButtonPress={() => validation()}
            icon="lock-reset"
            iconSet="MaterialCommunityIcons"
            labelFontSize={10}
            style={styles.resetButton}
          />

          <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION.TO_LOGIN)} style={styles.backWrap}>
            <Text style={styles.backLink}>{APP_TEXT.BACK_TO_LOGIN}</Text>
          </TouchableOpacity>
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
};

export default ChangePassword;

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
  logo: {
    width: 180,
    height: 48,
    alignSelf: 'center',
    marginVertical: 32,
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
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  gap: { height: 10 },
  resetButton: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 20,
  },
  backWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  backLink: {
    fontSize: 11,
    color: colors.PRIMARY_BUTTON,
    fontWeight: '600',
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
  swipeIcon: { marginBottom: 6 },
  swipeText: { fontSize: 10, fontWeight: '600', color: '#000' },
});
