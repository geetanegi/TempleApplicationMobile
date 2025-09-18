import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can change icon set
import {colors} from '../../global/theme/index';

const SecondaryHeader = ({title, navigate, textLeft}) => {
  const navigater = useNavigation();
  function handleBack() {
    navigater.goBack();
  }
  return (
    <View style={styles.header}>
      <Pressable onPress={navigate || handleBack}>
        <Icon name="arrow-back" size={28} color={colors.DARK_BLACK} />
      </Pressable>
      <Text
        style={[
          styles.headerTitle,
          textLeft && {textAlign: 'left', paddingHorizontal: 10},
        ]}>
        {title}
      </Text>
    </View>
  );
};

export default SecondaryHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
    color: colors.DARK_BLACK,
  },
});
