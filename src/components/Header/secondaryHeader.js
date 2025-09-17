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
    marginVertical: 15,
    marginBottom: 20,
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
