import {View, Text, TextInput, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import st from '../../global/styles';
import {colors, images} from '../../global/theme';
import Icon from 'react-native-vector-icons/Feather';
import {size, family} from '../../global/fonts';
const InputProfile = ({
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
//  alert(JSON.stringify(props.placeholder))
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = useRef(null); 
  // alert(JSON.stringify(value))
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
          backgroundColor: colors.white,
          opacity: 0.6,
          borderRadius: 6,
        //  borderColor:colors.black
          
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
            <Text style={style.asterisk}>*</Text>)}
          </View>
      )} 

      <TextInput
       ref={inputRef} 
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={style.inputtxt}
          {...props}
          placeholderTextColor={colors.black}
          
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
    borderRadius: 10,
    alignItems: 'center',
    position:'relative',
    marginTop: 10,
    borderWidth:1.5, 
   borderColor:colors.grey,
   // backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
   //       opacity: 0.6,
    
    height:50,
  },
  inputtxt:{
    fontSize: size.subtitle,
    color:colors.black,
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
    color: colors.DARK_GREY,
    marginLeft:10
  },
  asterisk: {
    fontSize: 16,
    color: 'red',
    marginLeft: 7,
  },
});

export default InputProfile;
