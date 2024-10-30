import {View, Text, TextInput, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import st from '../../global/styles';
import {colors, images} from '../../global/theme';
import Icon from 'react-native-vector-icons/Feather';
import {size, family} from '../../global/fonts';
const AdminInput = ({
  isRequired,
  holderName,
  label,
  value,
  iconName,
  error,
  inputsty,
  password,
  labelColor,
  textSty,
  search,
  onFocus = () => {},
  ...props
}) => {
//  alert(props.value)
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = useRef(null); 
  // alert(value)
  const handleTextInputPress = () => {
    // Focus the TextInput when the area is pressed
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={handleTextInputPress} activeOpacity={1}>
      <View
        style={{
          backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
          opacity: 0.6,
          borderRadius: 6,
          
        }}>
        {/* {label && (
          <Text
            style={[st.tx16, {color: !labelColor ? labelColor : colors.white}]}>
            {label}
          </Text>
        )} */}
        <View
          style={[
            style.inputContainer,
            inputsty,
            {paddingLeft: iconName ? 80 : 8},
          ]}>
         {((!isFocused && value?.trim() === '') || value == undefined )&& (
          <View style={style.placeholderContainer}>
            <Text style={style.placeholderText}>{holderName}</Text>
            {isRequired &&(
            <Text style={style.asterisk}>*</Text>
            )}
          </View>
       )}  

      <TextInput
       ref={inputRef} 
          autoCorrect={false}
          value={value} 
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={style.inputtxt}
          {...props}
          placeholderTextColor={'white'}
          
        />
    
       {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-off' : 'eye'}
            style={{fontSize: 22,marginTop:-9}}
            color={colors.white}
          />
        )}
        </View>
      </View>
      {error && (
        <Text style={[{color: colors.danger, fontSize: 12}]}>{error}</Text>
      )}
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  placeholdeR: {
    position: 'absolute',
    // top: 10,
    // left: 5,
    right:100,

    fontSize: 18,
    color: 'red',
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: colors.grey,
  },

  inputContainer: {
    // backgroundColor: colors.white,
    flexDirection: 'row',
    paddingLeft: 40,
    paddingRight:15,
    borderRadius: 7,
    alignItems: 'center',
    position:'relative',
    marginTop: 10,
  //  borderWidth:1.5, 
  //  borderColor:colors.white,
   // backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
   //       opacity: 0.6,
    
    height:40,
  },
  inputtxt:{
    fontSize: size.subtitle,
    color:'#E1D9D1',
    fontFamily: family.regular,
    flex:1,
    marginLeft:8
  },  placeholderContainer: {
    // position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    top:-5
    // marginTop:70
  },
  placeholderText: {
    fontSize: 16,
    color: 'white',
    marginLeft:10
  },
  asterisk: {
    fontSize: 16,
    color: 'red',
    marginLeft: 7,
  },
});

export default AdminInput;
