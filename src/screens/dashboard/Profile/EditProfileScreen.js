import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  UIManager,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { User } from 'lucide-react-native';
import { colors } from '../../../global/theme';
import st from '../../../global/styles';
import FloatingInput from '../../../components/floating_Input';
import {
  AlternativeValidateMail,
  ValidateCity,
  ValidateLocation,
  ValidateMobile,
  ValidateGHIN,
  Validatehdcp,
} from '../../../utils/helperfunctions/validations';
import { updateProfile, updateProfilePicture, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import Toast from 'react-native-simple-toast';
import ImageCropPicker from 'react-native-image-crop-picker';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const INITIALINPUT = {
  firstName: '',
  lastName: '',
  email: '',
  id: null,
  address: '',
  alternateEmail: '',
  city: '',
  contactNumber: '',
  countryCode: '',
  dateOfBirth: '',
  description: '',
  imageUrl: '',
  location: '',
  username: '',
};

const EditProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const item = route.params?.profile ?? null;

  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [newPictureUri, setNewPictureUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (item) {
        const up = item.userProfile || {};
        let dateOfBirth = '';
        if (up.dateOfBirth) {
          try {
            const d = new Date(up.dateOfBirth);
            dateOfBirth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          } catch (_) {}
        }
        setInputs(prev => ({
          ...prev,
          id: item.id ?? null,
          firstName: item.firstName ?? '',
          lastName: item.lastName ?? '',
          username: item.username ?? '',
          email: item.email ?? '',
          contactNumber: up.contactNumber ?? up.contact ?? item.phone ?? up.phone ?? '',
          countryCode: up.countryCode ?? '',
          alternateEmail: up.alternateEmail ?? '',
          city: up.city ?? '',
          location: up.location ?? '',
          description: up.description ?? item.bio ?? item.description ?? '',
          imageUrl: up.imageUrl ?? item.avatar ?? '',
          dateOfBirth,
        }));
      }
      return () => {};
    }, [item]),
  );

  const isEmpty = str => !str || (typeof str === 'string' && str.trim() === '');

  const handleSave = () => {
    if (!inputs.id) {
      Toast.show('Profile data not loaded.');
      return;
    }
    const errKeys = ['alternateEmail', 'location', 'city'];
    const hasErr = errKeys.some(k => !isEmpty(errors[k]));
    if (hasErr) return;
    handleSubmitPress();
  };

  const handleSubmitPress = async () => {
    setIsLoading(true);
    try {
      const userId = inputs.id;
      await updateProfile(userId, {
        description: inputs.description,
        location: inputs.location,
        city: inputs.city,
        alternateEmail: inputs.alternateEmail,
      });
      if (newPictureUri) {
        await updateProfilePicture(userId, newPictureUri);
        setNewPictureUri(null);
      }
      Toast.show('Profile updated.');
      navigation.goBack();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Update failed';
      Toast.show(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePicture = () => {
    ImageCropPicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
    })
      .then(asset => {
        const uri = asset.path || asset.sourceURL;
        if (uri) setNewPictureUri(uri);
      })
      .catch(e => {
        if (e?.code !== 'E_PICKER_CANCELLED') Toast.show('Could not open photo.');
      });
  };

  const handleOnchange = (text, input) => {

    if (input == 'location') {
      let validNumber;
      if (isEmpty(text)) {
        handleError('', 'location');
      }
      else {
        validNumber = ValidateLocation(text);
      }
      let isValid = true;
      if (validNumber != 'success') {
        handleError(validNumber, 'location');
        isValid = false;
      } else {
        handleError('', 'location');
      }
    }
    else if (input == 'city') {
      let validPassword;
      let isValid = true;
      if (isEmpty(text)) {
        handleError(validPassword, 'city');
      }
      else {
        validPassword = ValidateCity(text);
      }
      if (validPassword == 'success') {
        handleError('', 'city');
      } else {
        handleError(validPassword, 'city');
        isValid = false;
      }
    } else if (input == 'alternateEmail') {
      let validPassword;
      if (isEmpty(text)) {
        handleError('', 'alternateEmail');
      }
      else {
        validPassword = AlternativeValidateMail(text);
      }
      let isValid = true;

      if (validPassword == 'success') {
        handleError('', 'alternateEmail');
      } else {
        handleError(validPassword, 'alternateEmail');
        isValid = false;
      }
    }
    else if (input == 'contactNumber') {
      let isValid = true;
      let validPassword;
      if (isEmpty(text)) {
        handleError('', 'contactNumber');
      }
      else {
        validPassword = ValidateMobile(text);
      }

      if (validPassword == 'success') {
        handleError('', 'contactNumber');
      } else {
        handleError(validPassword, 'contactNumber');
        isValid = false;
      }
    }

    else if (input == 'ghin') {
      let isValid = true;
      let validPassword;
      if (isEmpty(text)) {
        handleError('', 'ghin');
      }
      else {
        validPassword = ValidateGHIN(text);
      }

      if (validPassword == 'success') {
        handleError('', 'ghin');
      } else {
        handleError(validPassword, 'ghin');
        isValid = false;
      }
    }
    else if (input == 'handicap') {
      let isValid = true;
      let validPassword;
      if (isEmpty(text)) {
        handleError('', 'handicap');
      }
      else {
        validPassword = Validatehdcp(text);
      }

      if (validPassword == 'success') {
        handleError('', 'handicap');
      } else {
        handleError(validPassword, 'handicap');
        isValid = false;
      }
    }
    
    // else if (input == 'cardNo') {
    //   let isValid = true;
    //   const validPassword = ValidateCardNumber(text);
    //   if (validPassword == 'success') {
    //     handleError('', 'cardNo');
    //   } else {
    //     handleError(validPassword, 'cardNo');
    //     isValid = false;
    //   }
    // }
    // else if (input == 'CVV') {
    //   let isValid = true;
    //   const validPassword = ValidateCVV(text);
    //   if (validPassword == 'success') {
    //     handleError('', 'CVV');
    //   } else {
    //     handleError(validPassword, 'CVV');
    //     isValid = false;
    //   }
    // }
    // else if (input == 'clubs') {
    //   let isValid = true;
    //   let validPassword;
    //   if (isEmpty(text)) {
    //     handleError('', 'clubs');
    //   }
    //   else {
    //     validPassword = ValidateClubs(text);
    //   }


    //   if (validPassword == 'success') {
    //     handleError('', 'clubs');
    //   } else {
    //     handleError(validPassword, 'clubs');
    //     isValid = false;
    //   }
    // } else if (input == 'ball') {
    //   let isValid = true;
    //   let validPassword;
    //   if (isEmpty(text)) {
    //     handleError('', 'ball');
    //   }
    //   else {
    //     validPassword = ValidateBall(text);
    //   }

    //   if (validPassword == 'success') {
    //     handleError('', 'ball');
    //   } else {
    //     handleError(validPassword, 'ball');
    //     isValid = false;
    //   }
    // }

    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const avatarUri = newPictureUri || resolveProfilePictureUrl(inputs.imageUrl);

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const handleExpirychange = (text, input) => {
    setInputs(prevState => ({
      ...prevState,
      ['expiryDate']: text.toISOString(),
    }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile picture – prominent and changeable */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handleChangePicture}
            style={styles.avatarTouch}
            activeOpacity={0.85}
          >
            <View style={styles.avatarWrap}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarIconWrap]}>
                  <User size={48} color={THEME.textMuted} strokeWidth={2} />
                </View>
              )}
              <View style={styles.cameraOverlay}>
                <Feather name="camera" size={28} color="#fff" />
              </View>
            </View>
            <Text style={styles.changePhotoLabel}>Tap to change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Basic info */}
        <Text style={styles.sectionTitle}>Basic info</Text>
        <View style={styles.formCard}>
          <View style={styles.row}>
            <View style={styles.half}>
              <FloatingInput
                label="First Name"
                value={inputs.firstName}
                onChangeText={t => handleOnchange(t, 'firstName')}
                onFocus={() => handleError('', 'firstName')}
                error={errors.firstName}
                editableField={false}
                placeholderTextColor={colors.DARK_GREY}
              />
            </View>
            <View style={styles.half}>
              <FloatingInput
                label="Last Name"
                value={inputs.lastName}
                onChangeText={t => handleOnchange(t, 'lastName')}
                onFocus={() => handleError('', 'lastName')}
                error={errors.lastName}
                editableField={false}
                placeholderTextColor={colors.DARK_GREY}
              />
            </View>
          </View>

          <FloatingInput
            label="Username"
            value={inputs.username}
            onChangeText={t => handleOnchange(t, 'username')}
            editableField={false}
            placeholderTextColor={colors.DARK_GREY}
          />

          <FloatingInput
            label="Bio"
            value={inputs.description}
            onChangeText={t => handleOnchange(t, 'description')}
            editableField={true}
            placeholderTextColor={colors.DARK_GREY}
          />
        </View>

        {/* Contact & location */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Contact & location</Text>
        <View style={[styles.formCard, { marginTop: 8 }]}>
          <View style={styles.row}>
            <View style={styles.half}>
              <FloatingInput
                label="Location"
                value={inputs.location}
                onChangeText={t => handleOnchange(t, 'location')}
                error={errors.location}
                editableField={true}
                placeholderTextColor={colors.DARK_GREY}
              />
            </View>
            <View style={styles.half}>
              <FloatingInput
                label="City"
                value={inputs.city}
                onChangeText={t => handleOnchange(t, 'city')}
                error={errors.city}
                editableField={true}
                placeholderTextColor={colors.DARK_GREY}
              />
            </View>
          </View>

          <FloatingInput
            label="Phone Number"
            value={
              inputs.countryCode && inputs.contactNumber
                ? `${inputs.countryCode}${inputs.contactNumber}`
                : inputs.contactNumber || inputs.countryCode || ''
            }
            onChangeText={t => handleOnchange(t, 'contactNumber')}
            error={errors.contactNumber}
            editableField={false}
            placeholderTextColor={colors.DARK_GREY}
          />

          <FloatingInput
            label="Primary Email"
            value={inputs.email}
            onChangeText={t => handleOnchange(t, 'email')}
            editableField={false}
            placeholderTextColor={colors.DARK_GREY}
          />

          <FloatingInput
            label="Alternate Email"
            value={inputs.alternateEmail}
            onChangeText={t => handleOnchange(t, 'alternateEmail')}
            error={errors.alternateEmail}
            editableField={true}
            placeholderTextColor={colors.DARK_GREY}
          />
        </View>

        {/* Actions */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const THEME = {
  primary: '#D48A4A',
  primaryDark: '#B07C57',
  bg: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1B1B1B',
  textMuted: '#7A7A7A',
  border: '#E7E0DA',
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarTouch: {
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: THEME.border,
  },
  avatarIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.card,
  },
  changePhotoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.primary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  formCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: { flex: 1 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 28,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: THEME.textMuted,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
