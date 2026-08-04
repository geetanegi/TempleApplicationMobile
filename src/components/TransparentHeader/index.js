import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransparentHeader = ({onBackPress}) => {
  return (
    <View style={[styles.backView, onBackPress ? styles.backViewWithButton : null]}>
      {onBackPress ? (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon name="arrow-back" size={28} color="#1B1B1B" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backView: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backViewWithButton: {
    height: Platform.OS === 'ios' ? 72 : 88,
    paddingTop: Platform.OS === 'ios' ? 8 : 28,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default TransparentHeader;
