import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can change icon set
import {colors} from '../../global/theme/index';

const SecondaryHeader = ({title}) => {
  const navigate = useNavigation();
  function handleBack() {
    navigate.goBack();
  }
  return (
    <View style={styles.header}>
      <Pressable onPress={handleBack}>
        <Icon name="arrow-back" size={28} color={colors.DARK_BLACK} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default SecondaryHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 24,
    color: colors.DARK_BLACK,
  },
});
