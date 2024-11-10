import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {APP_TEXT, colors} from '../../../global/theme';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import Feather from 'react-native-vector-icons/Feather';
import st from '../../../global/styles';
import FloatingInput from '../../../components/floating_Input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import MyPicker from '../../../components/picker';
import {API} from '../../../utils/endpoints';
import {postAuth} from '../../../utils/apicalls/postApi';
import Toast from 'react-native-simple-toast';
import {
  AlternativeValidateMail,
  ValidateCity,
  ValidateGHIN,
  Validatehdcp,
  ValidateLocation,
  ValidateMobile,
} from '../../../utils/helperfunctions/validations';

import AntDesign from 'react-native-vector-icons/AntDesign';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const INITIALINPUT = {
  firstName: '',
  lastName: '',
  activeStatus: '',
  email: '',
  id: null,
  address: '',
  alternateEmail: '',
  ball: '',
  city: '',
  clubs: '',
  code: '',
  contactNumber: '',
  dateOfBirth: '',
  ghin: '',
  handicap: '',
  imageUrl: '',
  location: '',
  transactionId: '',
  username: '',
  cardNo: '',
  cardName: '',
  CVV: '',
  expiryDate: '',
  courseIds: '',
};

const EditProfileScreen = ({item, course}) => {
  const [inputs, setInputs] = useState(INITIALINPUT);
  const [errors, setErrors] = useState(INITIALINPUT);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [dropDownCourceValue, setDropDownCourceValue] = useState('');
  const [courseIds, setCourseIds] = useState('');

  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const minDate = new Date();
  const maxDate = new Date();
  const handleModalOpen = () => {
    setIsVisible(true);
  };
  // const course = useSelector(state => state.course?.data?.data);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const [show, setShow] = useState(false);

  const onPressCourseSelect = () => {
    // alert("call")
    setShow(!show);
  };

  const handlePress = index => {
    // alert(expandedIndex)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  useFocusEffect(
    useCallback(() => {
      if (item && item.userProfile) {

        const utcDate = new Date(item.userProfile.dateOfBirth);
  
        // Convert it to the local date string
        const localDate = utcDate.toLocaleString();
        const year = utcDate.getFullYear();
        const month = String(utcDate.getMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getDate()).padStart(2, '0');
        // Update each input value individually
        setInputs(prevInputs => ({
          ...prevInputs,
          email: item.email || '',
          phone: item.userProfile.phone || '',
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          username: item.username || '',
          email: item.email || '',
          id: item.id || '',
          address: item.userProfile.email || '',
          alternateEmail: item.userProfile.alternateEmail || '',
          ball: item.userProfile.ball || '',
          city: item.userProfile.city || '',
          clubs: item.userProfile.clubs || '',
          code: '+1',
          contactNumber: item.userProfile.contactNumber || '',
          dateOfBirth: `${year}-${month}-${day}` || '',
          ghin: item.userProfile.ghin || '',
          handicap: item.userProfile.handicap || '',
          imageUrl: item.userProfile.imageUrl || '',
          location: item.userProfile.location || '',
        }));
      }
      return () => {
        // Perform any cleanup actions if necessary
     //   console.log('Screen unfocused, cleaning up Edit..');
      };

      //    console.log('---------useEffect-----edit profile screen ---', item);
    }, [item]),
  );

  const handleModalClose = () => {
    setIsVisible(false);
  };

  const isEmpty = str => {
    return !str || str.trim() === '';
  };

  const handleSave = () => {
  //  console.log('----inuourysss', inputs);


    // if (isEmpty(inputs.alternateEmail)) {
    //   const validNumber = AlternativeValidateMail(null);
    //   handleError(validNumber, 'alternateEmail');
    // }
    // if (isEmpty(inputs.location)) {
    //   const validNumber = ValidateLocation(null);
    //   handleError(validNumber, 'location');
    // }
    // if (isEmpty(inputs.city)) {
    //   const validNumber = ValidateCity(null);
    //   handleError(validNumber, 'city');
    // }
    // if (isEmpty(inputs.ghin)) {
    //   const validNumber = ValidateGHIN(null);
    //   handleError(validNumber, 'ghin');
    // }
    // if (isEmpty(inputs.clubs)) {
    //   const validNumber = ValidateClubs(null);
    //   handleError(validNumber, 'clubs');
    // }
    // if (isEmpty(inputs.ball)) {
    //   const validNumber = ValidateBall(null);
    //   handleError(validNumber, 'ball');
    // }
    // if (isEmpty(inputs.clubs)) {
    //   const validNumber = ValidateClubs(null);
    //   handleError(validNumber, 'clubs');
    // }
    // if (isEmpty(inputs.contactNumber)) {
    //   const validNumber = ValidateMobile(null);
    //   handleError(validNumber, 'contactNumber');
    // }
    // if (isEmpty(inputs.cardNo)) {
    //   const validNumber = ValidateCardNumber(null);
    //   handleError(validNumber, 'cardNo');
    // }
    // if (isEmpty(inputs.CVV)) {
    //   const validNumber = ValidateCVV(null);
    //   handleError(validNumber, 'CVV');
    // }

    if (
      isEmpty(errors.contactNumber) &&
      isEmpty(errors.alternateEmail) &&
      isEmpty(errors.location) &&
      isEmpty(errors.city) &&
      isEmpty(errors.ghin) &&
      isEmpty(errors.cardNo) &&
      isEmpty(errors.CVV) &&
      isEmpty(errors.handicap)
    ) {
    //  console.log('LOGIN_AUTH finally');
      handleSubmitPress();
    }
    //   syncUpdateProfile()

    // Handle save logic
    //    setIsVisible(false);
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
    const url = API.UPDATE_PROFILE;
    const params = {
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      email: inputs.email,
      selectedUserId: inputs.id,
      address: inputs.address,
      alternateEmail: inputs.alternateEmail,
      ball: inputs.ball,
      city: inputs.city,
      clubs: inputs.clubs,
      contactNumber: inputs.contactNumber,
      dateOfBirth: inputs.dateOfBirth,
      courseIds:courseIds,
      ghin: inputs.ghin,
      handicap: inputs.handicap,
      imageUrl: inputs.imageUrl,
      location: inputs.location,
      username: inputs.username,
    };
    setIsLoading(true);
    postAuth(url, params)
      .then(result => {
        if (!result?.error) {
        //  console.log('-----------result?.data?.message---',result?.data?.message)
          setIsLoading(false);
          Toast.show(result?.data?.message);
          setIsVisible(false);
        } else {
          setIsLoading(false);
          setIsVisible(false);
        }
      })
      .catch(err => {
        //console.log('LOGIN_AUTH catch', err);
        setIsLoading(false);
        setIsVisible(false);
      })
      .finally(() => {
        //console.log('LOGIN_AUTH finally');
        setIsLoading(false);
        setIsVisible(false);
      });
  };

  const handleCancel = () => {
    setSelectedLanguage(null)
    setInputs(prevInputs => ({
      ...prevInputs,
      phone: '',
      id: '',
      address: '',
      alternateEmail: '',
      ball: '',
      city: '',
      clubs: '',
      code: '+1',
      contactNumber: '',
      dateOfBirth: '',
      ghin: '',
      cardNo: '',
      cardName: '',
      CVV: '',
      expiryDate: '',
      location: '',
    }));

    setErrors(prevInputs => ({
      ...prevInputs,
      phone: '',
      id: '',
      address: '',
      alternateEmail: '',
      ball: '',
      city: '',
      clubs: '',
      contactNumber: '',
      dateOfBirth: '',
      ghin: '',
      cardNo: '',
      cardName: '',
      CVV: '',
      expiryDate: '',
      location: '',
    }));

      setDropDownCourceValue('')
    setIsVisible(false);
    // navigation.goBack(); // Go back to the previous screen
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

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const handleExpirychange = (text, input) => {
    setInputs(prevState => ({
      ...prevState,
      ['expiryDate']: text.toISOString(),
    }));
  };

  const renderHeader = () => {
    return (
      <View style={[styles.metricBox, {marginBottom: -48}]}>
        <Text style={styles.clubTitle}>Select Cource</Text>
      </View>
    );
  };

  const AccordionItem = ({item, onPress, expanded, index, expandedIndex}) => {
    return (
      <View style={{marginHorizontal: MARGIN.MARGIN_10}}>
        <TouchableOpacity
          onPress={() => _selectCource(item, index, expandedIndex)}
          style={styles.metricBoxInside}>
          <Text style={[styles.clubTitle, {marginHorizontal: 15}]}>
            {item.courseName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const _selectCource = (item, index, expandedIndex) => {
    setShow(!show);
    setCourseIds(item.id);
    setDropDownCourceValue(item.courseName);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <View>
      <TouchableOpacity style={styles.editIcon} onPress={handleModalOpen}>
        <Feather name="edit" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.formContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>Edit Profile</Text>
              <TouchableOpacity onPress={handleCancel}>
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="rgba(0, 0, 0, 0.5)"
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[st.modalcardsty, st.shadowProp]}>
                <View style={[st.mt_t20, st.row, st.justify_S]}>
                  <View style={[st.wdh45]}>
                    <FloatingInput
                      label={'First Name'}
                      onChangeText={text => handleOnchange(text, 'firstName')}
                      onFocus={() => handleError(null, 'firstName')}
                      error={errors?.firstName}
                      value={inputs.firstName}
                      inputsty={st.inputsty}
                      placeholderTextColor={'#fff'}
                      disable={false}
                      editableField={false}
                    />
                  </View>
                  <View style={[st.wdh45]}>
                    <FloatingInput
                      label={'Last Name'}
                      onChangeText={text => handleOnchange(text, 'lastName')}
                      onFocus={() => handleError(null, 'lastName')}
                      error={errors?.lastName}
                      value={inputs.lastName}
                      inputsty={st.inputsty}
                      placeholderTextColor={'#fff'}
                      disable={false}
                      editableField={false}
                    />
                  </View>
                </View>
                <View style={[st.mt_t7]}>
                  <FloatingInput
                    label={'Username'}
                    onChangeText={text => handleOnchange(text, 'username')}
                    error={errors?.username}
                    value={inputs.username}
                    inputsty={st.inputsty}
                    placeholderTextColor={'#fff'}
                    disable={false}
                    editableField={false}
                  />
                </View>
                <View style={[st.mt_t7]}>
                  <FloatingInput
                    label={'Date of Birth'}
                    onChangeText={text => handleOnchange(text, 'dateOfBirth')}
                    error={errors?.dateOfBirth}
                    value={inputs.dateOfBirth}
                    inputsty={st.inputsty}
                    placeholderTextColor={'#fff'}
                    disable={false}
                    editableField={false}
                  />
                </View>
                <View style={[st.mt_t7, st.row, st.justify_S]}>
                  <View style={[st.wdh45]}>
                    <FloatingInput
                      label={'Location'}
                      onChangeText={text => handleOnchange(text, 'location')}
                      error={errors?.location}
                      value={inputs.location}
                      inputsty={st.inputsty}
                      placeholderTextColor={'#fff'}
                      editableField={true}
                    />
                  </View>
                  <View style={[st.wdh45]}>
                    <FloatingInput
                      label={'City'}
                      onChangeText={text =>
                        handleOnchange(text, 'city')
                      }
                      error={errors?.city}
                      value={inputs.city}
                      inputsty={st.inputsty}
                      placeholderTextColor={'#fff'}
                      editableField={true}
                    />
                  </View>
                </View>
                {/* <View style={[st.mt_t7, st.row, st.justify_S]}> */}
                  {/* <View style={[st.wdh30]}>
                    <FloatingInput
                      label={'Code'}
                      onChangeText={text => handleOnchange(text, 'code')}
                      error={errors?.code}
                      value={inputs.code}
                      inputsty={st.inputsty}
                      placeholderTextColor={'#fff'}
                      editableField={true}
                    />
                  </View> */}
                   <View style={[st.mt_t7]}>
                   <FloatingInput
                      label={'Phone Number'}
                      onChangeText={text =>
                        handleOnchange(text, 'contactNumber')
                      }
                      error={errors?.contactNumber}
                      value={inputs.contactNumber}
                      inputsty={st.inputsty}
                      placeholderTextColor={'#fff'}
                      editableField={true}
                    />
                  </View>
                {/* </View> */}
                <View style={[st.mt_t7]}>
                  <FloatingInput
                    label={'Primary Email Address'}
                    onChangeText={text => handleOnchange(text, 'email')}
                    error={errors?.email}
                    value={inputs.email}
                    inputsty={st.inputsty}
                    placeholderTextColor={'#fff'}
                    disable={false}
                    editableField={false}
                  />
                </View>
              
                <View style={[st.mt_t7]}>
                  <FloatingInput
                    label={'Alternate Email address'}
                    onChangeText={text =>
                      handleOnchange(text, 'alternateEmail')
                    }
                    error={errors?.alternateEmail}
                    value={inputs.alternateEmail}
                    inputsty={st.inputsty}
                    placeholderTextColor={'#fff'}
                    editableField={true}
                  />
                </View>
              
        

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    // height:"50%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // For dimmed background
  },
  icon: {
    position: 'absolute',
    paddingTop: 13,
    right: 10, // Adjust the position as needed
    pointerEvents: 'none', // Ensure the icon doesn't interfere with Picker interaction
  },
  formContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
    // marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    marginRight: 10,
  },
  buttonRow: {
    // backgroundColor:'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  editIcon: {
    position: 'absolute',
    top: -70,
    right: '-50%',
    // backgroundColor:'red',
    backgroundColor: '#7EBE42',
    borderRadius: 20,
    padding: 5,
  },
  cancelButton: {
    backgroundColor: '#7B7887',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    width: 91,
    right: 15,
    alignItems: 'center',
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#95C11E',
    borderRadius: 5,
    width: 91,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.1,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.1,
  },
  metricBoxInside: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    height: SIZES.SIZES_50,
    marginTop: MARGIN.MARGIN_8,
    // marginHorizontal: MARGIN.MARGIN_10,
    borderRadius: RADIUS.RADIUS_8,
    backgroundColor: colors.white,
    elevation: ELEVATION.ELEVATION_8,
  },
  clubTitle: {
    color: colors.PRIMARY_LIGHT_TEXT,
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  metricBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    paddingHorizontal: PADDING.PADDING_15,
    height: SIZES.SIZES_48,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    marginTop: 5,
  },
});
