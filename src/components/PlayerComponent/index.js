import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  StatusBar,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, colors} from '../../global/theme';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../global/fonts';
import Icon from 'react-native-vector-icons/Octicons';
import st from '../../global/styles';
import {useDispatch} from 'react-redux';
import AppText from '../AppText';
import {clearLogin, setLogin} from '../../redux/reducers/Login';
import {SafeAreaView} from 'react-native-safe-area-context';
import {cleanLogindata, setLogindata} from '../../redux/reducers/Logindata';
import AntDesign from 'react-native-vector-icons/AntDesign';
const PlayerComponent = ({
  navigation,
  playerName,
  clubName,
  holeName,
  teeName,
}) => {
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };
  return (
    <View style={[styles.optionContainer]}>
      {/* <Image source={images.playerCover} style={styles.backgroundImage} /> */}
      <ImageBackground
        source={{
          uri: 'https://www.shutterstock.com/image-photo/front-view-golfer-driver-back-260nw-2446559499.jpg',
        }}
        style={styles.backgroundImage}>
        <View style={{paddingHorizontal: 20, top: 8}}>
          <CustomTextComponent
            title={'Saginaw Country Clubs'}
            style={styles.clubNameOverlay}
          />
          <CustomTextComponent title={'Saginaw, MI'} style={styles.clubPlace} />
        </View>
      </ImageBackground>
      <View style={styles.topComponent}>
        <Image source={images.playerCover} style={styles.profileImage} />
        <View style={styles.playerDetailsView}>
          <CustomTextComponent
            title={playerName}
            style={styles.playerNameTxt}
          />
          <View style={{flexDirection: 'row'}}>
            <Image source={images.LeftCourceImg} style={styles.golfIcon} />
            <CustomTextComponent title={clubName} style={styles.clubName} />
          </View>
          <View style={styles.teeDetails}>
            <CustomTextComponent title={holeName} style={styles.pointName} />
            <View style={styles.dot} />
            <CustomTextComponent title={teeName} style={styles.pointName} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlayerComponent;

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 110,
  },
  topComponent: {
    left:20,
    flexDirection: 'row',
  },
  profileImage: {
    width: 80,
    height: 110,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: -30,
  },
  playerDetailsView: {
    flexDirection: 'column',
    padding: 5,
  },
  playerNameTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  golfIcon: {
    tintColor: colors.PRIMARY_DARK,
    width: 18,
    height: 18,
  },
  clubName: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  teeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointName: {
    fontSize: 12,
    fontWeight: WEIGHT.WEIGHT_300,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
  },
  dot: {
    height: 6,
    width: 6,
    backgroundColor: 'gray',
    borderRadius: 3,
    marginHorizontal: 10,
  },
  clubNameOverlay: {
    fontSize: 16,
    fontWeight: WEIGHT.WEIGHT_700,
    color: colors.white,
    fontFamily: family.semibold,
  },
  clubPlace: {
    color: colors.white,
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_300,
  },
});
