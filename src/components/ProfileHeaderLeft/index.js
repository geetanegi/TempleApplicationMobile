import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

/**
 * Reusable header left button. Pass Icon (component) and onPress for custom behavior.
 * @param {React.Component} Icon - Icon component (e.g. ChevronLeft, Menu from lucide-react-native)
 * @param {function} onPress - Click handler
 * @param {number} size - Icon size
 * @param {string} color - Icon color
 */
const ProfileHeaderLeft = ({ Icon, onPress, size = 24, color = '#000' }) => {
  if (!Icon) return null;
  return (
    <Pressable onPress={onPress} style={styles.wrapper} hitSlop={12}>
      <Icon size={size} color={color} strokeWidth={2.5} />
    </Pressable>
  );
};

export default ProfileHeaderLeft;

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 8,
    justifyContent: 'center',
  },
});
