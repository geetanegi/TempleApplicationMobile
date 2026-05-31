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

const LINE_HEIGHT = 24;

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
  required = false,
  labelAbove = false,
  labelIcon,
  multiline = false,
  multilineLines,
  ...props
}) => {

  const moveText = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = React.useState(false);

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

  const handleTextInputPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View>
      {labelAbove && (
        <View style={styles.labelAboveRow}>
          {labelIcon && <View style={styles.labelIconWrap}>{labelIcon}</View>}
          <Text style={[styles.labelAbove, labelIcon && styles.labelAboveWithIcon]}>
            {label}
            {required && <Text style={styles.asterisk}> *</Text>}
          </Text>
        </View>
      )}
      <TouchableOpacity onPress={handleTextInputPress} activeOpacity={1}>
        <View
          style={[
            styles.container,
            labelAbove && styles.containerWithLabelAbove,
            multiline && styles.containerMultiline,
            multiline && multilineLines != null && {
              minHeight: multilineLines * LINE_HEIGHT + 24,
              maxHeight: multilineLines * LINE_HEIGHT + 24,
            },
            {
              borderColor: colors.grey,
              borderWidth: 1.5,
              backgroundColor: editableField ? '#FFF' : colors.grey,
            },
          ]}
        >
          {/* Placeholder or Label - hide when labelAbove is used */}
          {!labelAbove && ((!isFocused && value?.trim() === '') || value == undefined) && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                {label}
                {required && <Text style={styles.asterisk}> *</Text>}
              </Text>
            </View>
          )}
          
          <TextInput
            ref={inputRef}
            autoCapitalize={'none'}
            style={[
              styles.input,
              multiline && styles.inputMultiline,
              multiline && multilineLines != null && {
                minHeight: multilineLines * LINE_HEIGHT,
                maxHeight: multilineLines * LINE_HEIGHT,
              },
            ]}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            editable={editableField}
            blurOnSubmit={!multiline}
            multiline={multiline}
            // Cursor / selection color
            selectionColor={props.selectionColor ?? '#000'}
            cursorColor={props.cursorColor ?? props.selectionColor ?? '#000'}
            value={value}
            placeholderTextColor={props.placeholderTextColor ?? colors.DARK_GREY}
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
  labelAboveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelIconWrap: {
    marginRight: 6,
  },
  labelAbove: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.DARK_GREY || '#555',
  },
  labelAboveWithIcon: {
    marginBottom: 0,
  },
  containerWithLabelAbove: {
    marginTop: 0,
  },
  containerMultiline: {
    height: undefined,
    minHeight: 120,
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
  },
  container: {
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    height: 50,
    alignSelf: 'center',
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    top: 7,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.DARK_GREY,
    marginLeft: 5,
  },
  asterisk: {
    color: 'red', // Asterisk color (Red)
    fontSize: 16,
  },
  input: {
    ...st.tx14,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  icon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
