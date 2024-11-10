import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, colors} from '../../global/theme';
import Icon from 'react-native-vector-icons/Octicons';
import st from '../../global/styles';
import {useDispatch, useSelector} from 'react-redux';
import {clearLogin} from '../../redux/reducers/Login';
import {color} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {size, family} from '../../global/fonts';

const CourseDetailHeader = ({
  navigation,
   courceName,
  leftImg,
  golfPointImg,
  title,
  titleColor,
  titleSize,
  golfPointImgColor,
  screenTitle,
  
}) => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  // alert(screenTitle)

  return (
    <View style={styles.headerArea}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <Image source={leftImg} style={styles.leftImage} />
        <Text
          style={[
            st.headerCourceTitle,
            {fontSize: screenTitle == 'Tees' ? 12 : 14, paddingHorizontal: 5, top: 1},
          ]}>
          {courceName}
        </Text>
        <View style={{paddingHorizontal: 2}}>
          <AntDesign name="right" size={12} color="black" />
        </View>
        <Image
          tintColor={golfPointImgColor}
          source={golfPointImg}
          style={styles.golfPoint}
        />
        <Text
          style={{
            fontSize: titleSize,
            paddingHorizontal: 2,
            color: titleColor,
            fontFamily: family.medium,
            top: 1,
          }}>
          {title}
        </Text>
        {screenTitle == 'Tees' && (
          <>
            <View style={{paddingHorizontal: 7}}>
              <FontAwesome5 name="golf-ball" size={14} color="#95C11E" />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: '#95C11E',
                fontFamily: family.regular,
                top: 1,
              }}>
              {'Tees'}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default CourseDetailHeader;

const styles = StyleSheet.create({
  golfPoint: {
    paddingHorizontal: 2,
    width: 12.5,
    height: 15,
  },
  leftImage: {
    width: 18,
    height: 18,
  },
  headerArea: {
    height: 55,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: colors.white,
  },
});
