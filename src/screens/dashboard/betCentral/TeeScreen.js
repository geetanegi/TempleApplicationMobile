import {View,BackHandler} from 'react-native';
import React, { useState,useEffect } from 'react';
import st from '../../../global/styles';
import {APP_TEXT, colors, images, NAVIGATION} from '../../../global/theme';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import CourseDetailHeader from '../../../components/CourseDetailHeader';
import useNetworkStatus from '../../../hooks/networkStatus';
import {useFocusEffect} from '@react-navigation/native';
import TeeCartCheckout from './TeeCartCheckout';
import { getAllTeeByHoleId } from '../../../utils/apicalls/betContestHandler';

const CourceCart = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const CourseName = route?.params?.CourseName || '';
  const HoleId = route?.params?.HoleID || '';
  const isConnected = useNetworkStatus();
  const [tees, setTees] = useState();
  const HoleNumberParNumber = route?.params?.HoleNumberParNumber || '';

  const handleTeeList = async (HoleId) => {
    try {
      const TeeListData = await getAllTeeByHoleId(HoleId);
      if (TeeListData?.error) {
        setIsLoading(false);
    } else {
      setTees(TeeListData?.data);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleTeeList:", error); 
      setIsLoading(false);
      return null; 
    }
  };

  const startSync = () => {
    if (isConnected) {
      setIsLoading(true);
      handleTeeList(HoleId);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startSync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      startSync(); // Fetch the data when the screen is focused
      return () => backHandler.remove();
    }, []),
  );

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  const _onClickCourceDetails = (item) => {
    navigation.navigate(NAVIGATION.TO_PLAYINGCART, {
      checkOutItemList: item,
      HoleId:HoleId,
      courceName:CourseName,
      holeName:HoleNumberParNumber
    });
  };

  return (
    <View style={st.flex}>
      <Header
        drawerIcon={false}
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={APP_TEXT.TEES}
        backIcon={true}
      />
      {isLoading && <Loader />}
      <View style={st.couseContainer}>
        <CourseDetailHeader
          leftImg={images.LeftCourceImg}
          navigation={navigation}
          courceName={CourseName}
          holeName={HoleNumberParNumber}
          golfPointImg={images.golfPoint}
          golfPointImgColor={colors.PRIMARY_LIGHT_TEXT}
          titleColor={colors.PRIMARY_DARK}
          titleSize={12}
          title={HoleNumberParNumber}
          screenTitle={APP_TEXT.TEES}
        />
        <TeeCartCheckout
          courceData={tees}
          onPressList={_onClickCourceDetails}
        />
      </View>
    </View>
  );
};

export default CourceCart;
