import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Animated,
  Platform,
  UIManager,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  Alert,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';

const SubHeader = ({navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'black',
        justifyContent: 'flex-start',
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{paddingLeft: 8}}>
        <Image source={images.backIconHeader} style={styles.leftImage} />
      </TouchableOpacity>
      <Text style={[styles.listTitle, {fontSize: 20, left: 10}]}>
        Leaderboard
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  leftImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  listTitle: {
    fontSize: FONTSIZE.FONTSIZE_13,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
});

export default SubHeader;
