import {
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { images, APP_TEXT } from '../../../global/theme';
import { API } from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import { postAuth } from '../../../utils/apicalls/postApi';
import CourceList from './CourseListCard';


const HomeScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = useNetworkStatus();
  const [course, setCourse] = useState()

  const getAllCourse = async () => {
    try {
      const url = API.ALL_COURSE;
      const params = {};

      const result = await postAuth(url, params)
        .then(data => {
          setCourse(data?.data);
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          throw err;
        });
    } catch (err) {
      setIsLoading(false)
    }
  };

  const startSync = () => {
    if (isConnected) {
      setIsLoading(true);
      getAllCourse();
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
    navigation.navigate('CourceDetails', { CourseId: item?.id,CourseName:item?.courseName })
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={APP_TEXT.COURSE}
        backIcon={false}
      />
      {isLoading && <Loader />}
      <View style={styles.container}>
        <CourceList
          courceData={course}
          onPressList={
            _onClickCource
          }
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
