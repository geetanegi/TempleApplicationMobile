import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '../../global/theme';

const CategoryButton = ({icon, label, navigateTo, color = colors.orange}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={[styles.container]}
      onPress={() => navigation.navigate(navigateTo)}>
      <View style={[styles.iconWrapper, {backgroundColor: color}]}>
        <Icon name={icon} size={16} color="#fff" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CategoryButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 1,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 55 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});
