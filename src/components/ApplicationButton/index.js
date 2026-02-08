import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import st from '../../global/styles';
import {colors, APP_TEXT} from '../../global/theme';

const ApplicationButton = ({onButtonPress, label, disabled, backgroundColor, icon, iconSet, iconColor, labelFontSize, style: customStyle}) => {
  const color = iconColor ?? colors.black;
  const iconSize = labelFontSize ? labelFontSize + 6 : (iconSet === 'MaterialCommunityIcons' ? 20 : 18);
  const renderIcon = () => {
    if (!icon) return null;
    if (iconSet === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={icon} size={iconSize} color={color} />;
    }
    return <Feather name={icon} size={iconSize} color={color} />;
  };
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
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        customStyle,
      ]}>
      {renderIcon()}
      <Text style={[st.tx16, {color}, labelFontSize ? { fontSize: labelFontSize } : null]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ApplicationButton;
