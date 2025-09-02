// components/CustomHeader.js
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors, images} from '../../global/theme';

export default function CustomHeader({image = images.logo, title}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.left}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      {/* Logo in Center */}
      <View style={styles.center}>
        {!title ? (
          <Image
            source={image} // replace with your logo path
            style={{width: 90, height: 30, resizeMode: 'contain'}}
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>

      {/* Right placeholder (optional if you want icons later) */}
      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 28,
    backgroundColor: '#fff',
    elevation: 2, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  left: {width: 40},
  center: {flex: 1, alignItems: 'center'},
  right: {width: 40},
  title: {fontSize: 18, fontWeight: 'semibold', color: colors.black},
});
