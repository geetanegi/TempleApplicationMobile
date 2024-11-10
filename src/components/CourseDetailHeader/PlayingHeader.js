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
import { Trophy } from 'lucide-react-native';

const PlayingHeader = ({
  navigation,
   courceName,
  leftImg,
  golfPointImg,
  img,
  title,
  titleColor,
  titleSize,
  golfPointImgColor,
  screenTitle,
  teeName
  
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
          flexDirection: 'row', // Items will be placed in a row
          flexWrap: 'wrap',     // When items overflow, they wrap to the next line
          width:'100%',
          alignItems: 'center',
          backgroundColor: 'transparent',
          marginLeft:25,
          marginTop:10
        }}>
        <Image source={leftImg} style={styles.leftImage} />
        <Text
          style={[
            st.headerCourceTitle,
            {fontSize: screenTitle == 'Tees' ? 12 : 14, paddingHorizontal: -4, top: 1},
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
        <View style={{paddingHorizontal: 2}}>
          <AntDesign name="right" size={12} color="black" />
        </View>
        <Image
          tintColor={golfPointImgColor}
          source={img}
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
        {teeName}
        </Text>
        {screenTitle == 'Tees' && (
          <>
            <View style={{paddingHorizontal: 7}}>
              <Trophy size={14} color="#95C11E" />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: '#95C11E',
                fontFamily: family.regular,
                top: 1,
              }}>
              {'Contests'}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default PlayingHeader;

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
