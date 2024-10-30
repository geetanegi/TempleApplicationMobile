import {
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import { images } from '../../../global/theme';
import { API } from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import CourseDetailHeader from '../../../components/CourseDetailHeader';
import { postAuth } from '../../../utils/apicalls/postApi';
import { useFocusEffect } from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import HoleList from './holesListCard';

const CourceDetails = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const couseId = route?.params?.CourseId || '';
  const courseName= route?.params?.CourseName || '';
  const isConnected = useNetworkStatus();
  const [hole, setHoles] = useState();

  const getAllCourse = async () => {
    try {
      const url = API.HOLE_BY_COURSEID;
      const params = {
        courseId:couseId
      };

      const result = await postAuth(url, params)
        .then(data => {
          setHoles(data?.data);
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


  const _onClickCourceDetails = (item) => {
    const holeNumber=item.holeNumber;
    const par=item?.par;
    let HoleNumberParNumber = `Hole #${holeNumber} Par-${par}`;
    navigation.navigate('CourceCart', { HoleID:item?.id ,CourseName:courseName ,HoleNumberParNumber:HoleNumberParNumber})
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={'Holes'}
        backIcon={true}
      />
      {isLoading && <Loader />}
      <View style={styles.container}>
        <CourseDetailHeader
          leftImg={images.LeftCourceImg}
          navigation={navigation}
          holeName={courseName}
          courceName={courseName}
          golfPointImg={images.golfPoint}
          golfPointImgColor={'#95C11E'}
          title={'Holes'}
          screenTitle={'Holes'}
          titleColor={'#95C11E'}
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
