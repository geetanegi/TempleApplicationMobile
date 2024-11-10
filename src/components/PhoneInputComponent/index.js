// import {View, Text, TextInput, StyleSheet, Image} from 'react-native';
// import React, {useState, useRef} from 'react';
// import st from '../../global/styles';
// import {colors, images} from '../../global/theme';
// import Icon from 'react-native-vector-icons/Feather';
// import {size, family} from '../../global/fonts';
// import PhoneInput from 'react-native-phone-number-input';

// const PhoneInputComponent = ({
//   label,
//   defaultCode = 'US',
//   onChangePhoneNumber,
// }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [formattedValue, setFormattedValue] = useState('');
//   const [valid, setValid] = useState(false);
//   const [showMessage, setShowMessage] = useState(false);

//   // onPress={() => {
//   //   const checkValid = phoneInput.current?.isValidNumber(value);
//   //   setShowMessage(true);
//   //   setValid(checkValid ? checkValid : false);
//   // }}

//   const phoneInput = useRef(null);
//   return (
//     <View style={styles.container}>
//       <PhoneInput
//         ref={phoneInput}
//         defaultValue={phoneNumber}
//         defaultCode={defaultCode}
//         disableArrowIcon={false}
//         layout="first"
//         // layout="second"
//         onChangeText={text => {
//           console.log('onChangeText', text);
//           setPhoneNumber(text);
//           // if (onChangePhoneNumber) {
//           //   onChangePhoneNumber(text);
//           // }
//         }}
//         onChangeFormattedText={text => {
//           // alert(text)
//           setPhoneNumber(text);
//           if (onChangePhoneNumber) {
//             onChangePhoneNumber(text);
//           }
//           console.log('Formatted Phone Number:', text); // This will give you the formatted phone number
//         }}
//         containerStyle={styles.phoneContainer}
//         textContainerStyle={styles.textInput}
//         codeTextStyle={styles.codeText}
//         arrowStyle={styles.arrow}
//         textInputProps={{
//           placeholder: 'Phone',
//           placeholderTextColor: '#FFF',
//           fontSize: size.subtitle,
//           color: colors.white,
//           fontFamily: family.regular,
//         }}
//         // withDarkTheme
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {},
//   phoneContainer: {
//     width: '100%',
//     height: 48,
//     borderRadius: 6,
//     backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
//     opacity: 0.6,
//     borderWidth: 1,
//     borderColor: '#FFF',
//   },
//   textInput: {
//     paddingVertical: 0,
//     borderRadius: 6,
//     backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
//     color: '#FFF',
//     left: -30,
//   },
//   codeText: {
//     fontWeight: 400,
//     fontSize: size.subtitle,
//     color: colors.white,
//   },

//   arrow: {
//     color: 'red',
//   },
// });

// export default PhoneInputComponent;
