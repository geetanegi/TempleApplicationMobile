import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, APP_TEXT, NAVIGATION } from '../../../global/theme';
import AdminInput from '../../../components/adminInput';
import TransparentHeader from '../../../components/TransparentHeader';
import ApplicationButton from '../../../components/ApplicationButton';
import Checkbox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ValidatePassword,
  ValidateUserName,
} from '../../../utils/helperfunctions/validations';
import { setLogin } from '../../../redux/reducers/Login';
import { storeTokenData } from '../../../utils/apicalls/tokenApi';
import { API } from '../../../utils/endpoints';
import { setLogindata } from '../../../redux/reducers/Logindata';
import { postNoAuth } from '../../../utils/apicalls/postApi';
import Loader from '../../../components/loader';
import PopUpMessage from '../../../components/popup';
import { useDispatch } from 'react-redux';
import st from '../../../global/styles';
const INITIALINPUT = {
  username: '',
  password: '',
};

const Verifyemail = ({navigation}) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const dispatch = useDispatch();

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

  const handleChange = (text, field) => {
    setInputs(prev => ({ ...prev, [field]: text }));

    if (field === 'username') {
      const v = ValidateUserName(text);
      setErrors(prev => ({ ...prev, username: v === 'success' ? '' : v }));
    }

    if (field === 'password') {
      const v = ValidatePassword(text);
      setErrors(prev => ({ ...prev, password: v === 'success' ? '' : v }));
    }
  };

  const onLogin = async () => {
    if (errors.username || errors.password) return;

    if (isChecked) {
      await AsyncStorage.setItem('username', inputs.username);
      await AsyncStorage.setItem('password', inputs.password);
    }

    setIsLoading(true);
    postNoAuth(API.LOGIN_AUTH, {
      username: inputs.username,
      password: inputs.password,
      mode: 'Mobile',
    })
      .then(res => {
        if (!res?.error) {
          storeTokenData(res?.data?.token);
          dispatch(setLogindata(res?.data));
          dispatch(setLogin(true));
        } else {
          setTitle('Oops!');
          setSubtitle(res?.description);
          setPopupMessageVisibility(true);
        }
      })
      .catch(err => {
        setTitle('Error');
        setSubtitle(err?.message || 'Something went wrong');
        setPopupMessageVisibility(true);
      })
      .finally(() => setIsLoading(false));
  };


  const validation = () => {
    
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Cream Header */}
      <View style={styles.topBg} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TransparentHeader />
      <View style={styles.card}>
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

          <View
            style={{
              width: '100%',
              paddingVertical: 1,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.PRIMARY_DARK,
                lineHeight: 19.1,
                padding: 5,
                fontSize: 15,
                textAlign: 'center',
              }}>
              {APP_TEXT.RESET_2}
            </Text>
          </View>

   <View style={styles.form}>
  
          </View>


          <View style={styles.form}>
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
            />
            <View style={styles.gap} />
            </View>

          <View style={[st.fcardsty, st.shadowProp]}>

{/* 
            <View style={[st.mt_B10]}>
              <ApplicationButton
                backgroundColor={colors.PRIMARY_BUTTON}
                label={APP_TEXT.SEND_OTP}
                onButtonPress={() => {
                  validation();
                }}
              />
            </View> */}
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBtnWrap}>
        <ApplicationButton
          backgroundColor={colors.PRIMARY_BUTTON}
          label={APP_TEXT.SEND_OTP}
          onButtonPress={validation}
        />
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
    backgroundColor: '#F5D19A',
  },

  scroll: {
    paddingBottom: 160,
  },

  brand: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginVertical: 20,
  },

  card: {
    marginTop: 30,
    //   marginHorizontal: 18,
       backgroundColor: '#FFFFFF',
       borderTopLeftRadius: 28,
       paddingTop: 22,
  },
  container: { justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 10, marginHorizontal: 5, },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  gap: {
    height: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  form: { paddingTop: 6 ,padding:35},
  remember: {
    marginLeft: 10,
    fontSize: 14,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
    letterSpacing: 0.4,
  },

  links: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  linkText: {
    fontSize: 13,
  },

  link: {
    color: colors.PRIMARY_BUTTON,
    fontWeight: '600',
  },
  bottomBtnWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
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

  swipeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  txtSignUp: { fontSize: 14, color: colors.PRIMARY_SOLID_TEXT, // fontFamily: family.semibold, textAlign: 'center', // letterSpacing: 0.6, 
    },
});
