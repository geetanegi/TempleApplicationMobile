import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useRef} from 'react';
import st from '../../global/styles';
import {colors, APP_TEXT} from '../../global/theme';

const ApplicationButton = ({onButtonPress, label,disabled,backgroundColor}) => {
  return (
    <TouchableOpacity
    disabled={disabled}
      onPress={() => {
        onButtonPress();
      }}
      style={[
        st.align_C,
        st.justify_C,
        st.mt_t20,
        {
          backgroundColor: backgroundColor ? backgroundColor : colors.white,
          height: 40,
          borderRadius: 6,
        },
      ]}>
      <Text style={[st.tx16, {color: colors.white}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ApplicationButton;
