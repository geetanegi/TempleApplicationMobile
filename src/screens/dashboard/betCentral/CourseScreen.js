import {
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { images, APP_TEXT, NAVIGATION } from '../../../global/theme';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import CourceList from './CourseListCard';
import { getAllCourseDetailList } from '../../../utils/apicalls/betContestHandler';
import st from '../../../global/styles';

const CourseScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = useNetworkStatus();
  const [course, setCourse] = useState()

  const handleCourseList = async () => {
    try {
      const courseListData = await getAllCourseDetailList();
      if (courseListData?.error) {
        setIsLoading(false);
    } else {
       setCourse(courseListData?.data);
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
      handleCourseList();
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

  const _onClickCource = (item) => {
    navigation.navigate(NAVIGATION.TO_COURSE_DETAIL, { CourseId: item?.id,CourseName:item?.courseName })
  }

  return (
    <View style={st.flex}>
      <Header
        drawerIcon={true}
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={APP_TEXT.COURSE}
        backIcon={false}
      />
      {isLoading && <Loader />}
      <View style={st.couseContainer}>
        <CourceList courceData={course} onPressList={_onClickCource} />
      </View>
    </View>
  );
};

export default CourseScreen;