import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import st from '../../global/styles';
import {colors} from '../../global/theme';

const TestScreen = ({
  label,
  iconName,
  error,
  inputsty,
  password,
  onFocus = () => {},
  onBlur = () => {},
  disable,
  editableField,
  value,
  ...props
}) => {

  const moveText = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = React.useState(false);
  // useEffect(() => {
  //   if (value !== '') {
  //     moveTextTop();
  //   } else if (value === '') {
  //     moveTextBottom();
  //   }
  // }, [value]);

  // const onChangeText = text => {
  //   setValue(text);
  // };

  const onFocusHandler = () => {
    if (value !== '') {
      moveTextTop();
    }
  };

  const onBlurHandler = () => {
    if (value === '') {
      moveTextBottom();
    }
  };

  const moveTextTop = () => {
    Animated.timing(moveText, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const moveTextBottom = () => {
    Animated.timing(moveText, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const yVal = moveText.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -20],
  });

  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
    ],
  };

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
          style={[
            styles.container,
            {
              borderColor: colors.grey,
              borderWidth: 1.5,
              // backgroundColor: editableField ? 'transparent' : 'red',
              backgroundColor:editableField ? '#FFF' : colors.grey,
            },
          ]}>

{((!isFocused && value?.trim() === '') || value == undefined )&& (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{label}</Text>
          
          </View>
      )} 
          {/* <Animated.View style={[styles.animatedStyle, animStyle]}>
            <Text
              style={[
                st.tx14,
                {
                  color: colors.black,
                  backgroundColor: value ? colors.white : null,
                  paddingHorizontal: 10,
                },
              ]}>
              {label}
            </Text>
          </Animated.View> */}

          <TextInput
            ref={inputRef}
            autoCapitalize={'none'}
            style={[styles.input]}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            editable={editableField}
            blurOnSubmit
            selectionColor={'#fff'}
            value={value}
            placeholderTextColor={'#fff'}
            {...props}
          />

          {iconName && (
            <Image
              source={iconName}
              style={{position: 'absolute', top: 10, right: 15}}
            />
          )}
        </View>
        {error && (
          <Text style={[{color: colors.danger, fontSize: 12}]}>{error}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default TestScreen;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 20,
    // backgroundColor: '#fff',
    // paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    height: 50,
    alignSelf: 'center',
  },placeholderContainer: {
    // position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    top:7
    // marginTop:70
  },
  placeholderText: {
    fontSize: 16,
    color: colors.DARK_GREY,
    marginLeft:5
  },
  icon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    // fontSize: 13,
    // height: 35,
    // color: '#CACACA',
    ...st.tx14,
  },
  label: {
    color: 'grey',
    fontSize: 10,
  },
  animatedStyle: {
    top: 9,
    left: 15,
    position: 'absolute',
    borderRadius: 90,
    zIndex: 10000,
  },
});
