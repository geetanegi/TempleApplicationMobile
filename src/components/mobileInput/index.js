import {View, Text, TextInput, StyleSheet, Image} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import st from '../../global/styles';
import {colors, images} from '../../global/theme';
import Icon from 'react-native-vector-icons/Feather';
import {size, family} from '../../global/fonts';
const MobieInput = ({
  label,
  value,
  iconName,
  error,
  inputsty,
  password,
  labelColor,
  textSty,
  onFocus = () => {},
  ...props
}) => {
//  alert(JSON.stringify(props.placeholder))
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);

  // alert(JSON.stringify(value))

  return (
    <View>
      <View
        style={{
          backgroundColor: colors.PRIMARY_TRANSPARENT_BLACK,
          opacity: 0.6,
          borderRadius: 6,
        }}>
        {label && (
          <Text
            style={[st.tx16, {color: !labelColor ? labelColor : colors.white}]}>
            {label}
          </Text>
        )}
        <View
          style={[
            style.inputContainer,
            inputsty,
            {paddingLeft: iconName ? 40 : 8},
          ]}>
          {iconName && (
            <Icon
              name={iconName}
              style={{
                position: 'absolute',
                top: 10,
                left: 15,
                width: 25,
                height: 25,
                color: colors.grey,
              }}
              color={colors.grey}
              size={20}
            />
          )}

          <TextInput
            placeholderTextColor="#FFF"
            autoCorrect={false}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={hidePassword}
            style={style.inputtxt}
            {...props}
            
            // placeholder={placeholderText}
          />
        
          {!value && <Text style={style.placeholdeR}> * </Text>}
          {password && (
            <Icon
              onPress={() => setHidePassword(!hidePassword)}
              name={hidePassword ? 'eye' : 'eye-off'}
              style={{fontSize: 22}}
            />
          )}
        </View>
      </View>
      {error && (
        <Text style={[{color: colors.danger, fontSize: 12}]}>{error}</Text>
      )}
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
    // flexDirection: 'row',
    // paddingLeft: 40,
    // paddingRight: 15,
    borderRadius: 6,
    // alignItems: 'center',
    // marginTop: 10,
    borderWidth: 1,
    borderColor: colors.white,
    height: 50,
  },
  inputtxt: {
    fontSize: size.subtitle,
    color: colors.white,
    fontFamily: family.regular,
    flex: 1,
  },
});

export default MobieInput;
