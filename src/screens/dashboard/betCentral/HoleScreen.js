import {View,BackHandler} from 'react-native';
import React, { useState,useEffect } from 'react';
import { APP_TEXT, colors, images, NAVIGATION } from '../../../global/theme';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import CourseDetailHeader from '../../../components/CourseDetailHeader';
import { useFocusEffect } from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import HoleList from './holesListCard';
import st from '../../../global/styles';
import { getAllHoleByCourseId } from '../../../utils/apicalls/betContestHandler';

const CourceDetails = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const couseId = route?.params?.CourseId || '';
  const courseName= route?.params?.CourseName || '';
  const isConnected = useNetworkStatus();
  const [hole, setHoles] = useState();
  const handleHoleList = async (couseId) => {
    try {
      const holeListData = await getAllHoleByCourseId(couseId);
      if (holeListData?.error) {
        setIsLoading(false);
    } else {
      setHoles(holeListData?.data);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };

  const startSync = () => {
    if (isConnected) {
      setIsLoading(true);
      handleHoleList(couseId);
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
    navigation.goBack()
    return true;
  };


  const _onClickCourceDetails = (item) => {
    const holeNumber=item.holeNumber;
    const par=item?.par;
    let HoleNumberParNumber = `Hole #${holeNumber} Par-${par}`;
    navigation.navigate(NAVIGATION.TO_COURSECART, { HoleID:item?.id ,CourseName:courseName ,HoleNumberParNumber:HoleNumberParNumber})
  }

  return (
    <View style={st.flex}>
      <Header
        drawerIcon={false}
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={APP_TEXT.HOLES}
        backIcon={true}
      />
      {isLoading && <Loader />}
      <View style={st.couseContainer}>
        <CourseDetailHeader
          leftImg={images.LeftCourceImg}
          navigation={navigation}
          holeName={courseName}
          courceName={courseName}
          golfPointImg={images.golfPoint}
          golfPointImgColor={colors.green}
          title={APP_TEXT.HOLES}
          screenTitle={APP_TEXT.HOLES}
          titleColor={colors.green}
          titleSize={12}
        />

        <HoleList
          holeData={hole}
          onPressList={_onClickCourceDetails}
        />
      </View>
    </View>
  );
};

export default CourceDetails;

