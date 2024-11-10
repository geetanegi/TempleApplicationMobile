import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  BackHandler,
} from 'react-native';
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
} from '../../../global/fonts';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import {store} from '../../../redux/store';
import {API} from '../../../utils/endpoints';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import ButtonCheckout from '../../../components/ButtonCheckout';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {postAuth} from '../../../utils/apicalls/postApi';
import {getUserAgentSync} from 'react-native-device-info';
import {getUserId} from '../../../redux/store/getState';

const EnterQueueHome = ({navigation, route}) => {
  const backIconVisibility = route?.params?.backIconVisibility || false;
  const [isLoading, setIsLoading] = useState(false);
  const CourseName = route?.params?.QueData?.data?.courseName || '';
  const firstName = route?.params?.QueData?.data?.firstName || '';
  const holeNumber = route?.params?.QueData?.data?.holeNumber || '';
  const teeName = route?.params?.QueData?.data?.teeName || '';
  const yardage = route?.params?.QueData?.data?.yardage || '';
  const par = route?.params?.QueData?.data?.par || '';
  const HoleId = route?.params?.HoleID || '';
  const isConnected = useNetworkStatus();
  const [teeDetaild, setParamsTeeDetail] = useState();
  const HoleNumberParNumber = route?.params?.HoleNumberParNumber || '';
  const ClubName =
    route?.params?.QueData?.data?.clubName || 'Saginaw Country Club99';

 //   console.log('-----routeeeeeeeee',route.params.QueData)
  // const startSync = () => {
  //   if (isConnected) {
  //     setIsLoading(true);
  //   } else {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   startSync();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      //   startSync(); // Fetch the data when the screen is focused
      return () => backHandler.remove();
    }, []),
  );

  const handleBackPress = () => {
    navigation.navigate('Dashboard');
    return true;
  };

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const handleSubmit = () => {
    navigation.navigate('TeeBoxScreen', {data: route?.params?.QueData?.data});
    // navigation.navigate('HitTheGreen')
  };
  return (
    <View style={styles.parentContainer}>
      <Header
        drawerIcon={false}
        navigation={navigation}
        backIcon={backIconVisibility ? true : false}
        title={'Contest Queue'}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
        {/* <Image source={images.playerCover} style={styles.backgroundImage} /> */}
        <ImageBackground
          // source={images.playerCover}
          source={{
            uri: 'https://www.shutterstock.com/image-photo/front-view-golfer-driver-back-260nw-2446559499.jpg',
          }}
          style={styles.backgroundImage}>
          <View style={{padding: 20}}>
            <CustomTextComponent
              title={ClubName}
              style={styles.clubNameOverlay}
            />
            {/* <CustomTextComponent
              title={'Saginaw, MI'}
              style={styles.clubPlace}
            /> */}
          </View>
        </ImageBackground>
        <View style={styles.profileContainer}>
        {!route?.params?.QueData?.data?.imageBase64 ? (
            <Image source={images.playerCover} style={styles.profileImage} />
        ) : (
          <Image
            source={{
              uri: `data:image/jpg;base64,${route?.params?.QueData?.data?.imageBase64}`,
            }}
            style={styles.profileImage}
          />
        )}
       
        </View>

        <View style={[styles.optionContainer]}>
          <CustomTextComponent
            title={'hello ' + firstName}
            style={styles.playerNameTxt}
          />
          <CustomTextComponent title="Welcome to" style={styles.welcome} />
          <Image source={images.LeftCourceImg} style={styles.golfIcon} />
          <CustomTextComponent title={ClubName} style={styles.clubName} />
          <View style={{flexDirection: 'row', marginTop: 30}}>
            <Image
              tintColor={'#7B7887'}
              source={images.golfPoint}
              style={styles.golfPoint}
            />
            <CustomTextComponent
              title={'Hole #' + holeNumber + ', Par' + par}
              style={styles.pointName}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <FontAwesome5 name="golf-ball" size={18} color={colors.black} />
            <CustomTextComponent
              title={teeName + ' (' + yardage + ' yards)'}
              style={styles.pointName}
            />
          </View>
        </View>
        <View style={[styles.BtnContainer]}>
          <ButtonCheckout
            title="Enter Queue"
            onPressCheckout={handleSubmit}
            img={false}
          />
        </View>
        <ImageBackground
          source={images.backgroundGolf}
          style={[styles.bottomImage, {pointerEvents: 'none'}]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 188,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  queueButton: {
    marginTop: 20,
    backgroundColor: '#9acd32',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  optionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 10,
  },
  BtnContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 50,
    paddingBottom: 150,
  },
  playerNameTxt: {
    fontSize: FONTSIZE.FONTSIZE_18,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  welcome: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    marginTop: 40,
  },
  golfIcon: {
    tintColor: colors.PRIMARY_DARK,
    width: 32,
    marginTop: 10,
    height: 32,
  },
  clubName: {
    fontSize: FONTSIZE.FONTSIZE_24,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    marginTop: 10,
  },
  golfPoint: {
    width: 18,
    height: 18,
  },
  pointName: {
    fontSize: 16,
    fontWeight: WEIGHT.WEIGHT_300,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    paddingHorizontal: 15,
  },
  bottomImage: {
    width: 200,
    height: 377,
    position: 'absolute',
    bottom: 188,
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

export default EnterQueueHome;
