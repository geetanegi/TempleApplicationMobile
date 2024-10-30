import {
  StyleSheet,
  Text,
  Image,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  Linking,
  View,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';

import React, {useState, useRef, useEffect} from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {useDispatch, useSelector} from 'react-redux';

import LoginImg from '../../../components/loginImage';
import {API} from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import CourseDetailHeader from '../../../components/CourseDetailHeader';
import useNetworkStatus from '../../../hooks/networkStatus';
import { useFocusEffect } from '@react-navigation/native';
import { postAuth } from '../../../utils/apicalls/postApi';
import TeeCartCheckout from './TeeCartCheckout';
import CourceCartCheckout from '../../../components/CourceCartCheckout';
//LeftCourceImg

const data = {
  sections: [
    {
      id: '1',
      name: 'Blue Tees (157 Yards)',
      value: 5,
      accordianItem: [
        {id: '11',name: 'Closest-to-Pin', price: 5, date: 'Jan 10 - Feb 10'},
        {id: '12',name: 'Hole-in-One', price: 13, date: 'Jan 15 - Feb 12'},
      ],
    },
    {
      id: '2',
      name: 'White Tees (147 Yards)',
      value: 5,
      accordianItem: [
        {id: '21',name: 'Hole-in-One', price: 10, date: 'Jan 10 - Feb 10'},
        {id: '22',name: 'Closest-to-Pin', price: 5, date: 'Jan 14 - Feb 20'},
      ],
    },
    {
      id: '3',
      name: 'Gold Tees (127 Yards)',
      value: 5,
      accordianItem: [
        {id: '31',name: 'Hole-in-One', price: 13, date: 'Jan 10 - Feb 13'},
        {id: '32',name: 'Closest-to-Pin', price: 5, date: 'Jan 10 - Feb 5'},
      ],
    },
  ],
};


const imageData = [
  {
    id: '1',
    name: 'Blue Tees (157 Yards)',
    accordianItem: 'Accordion Item 1',
    value: 5,
  },
  {
    id: '2',
    name: 'White Tees (147 Yards)',
    accordianItem: 'Accordion Item 2',
    value: 5,
  },
  {
    id: '3',
    name: 'Gold Tees (127 Yards)',
    accordianItem: 'Accordion Item 3',
    value: 5,
  },
];

const CourceCart = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const CourseName = route?.params?.CourseName || '';
  const HoleId=route?.params?.HoleID || '';
  const isConnected = useNetworkStatus();
  const [tees, setTees] = useState();
  const HoleNumberParNumber= route?.params?.HoleNumberParNumber || '';
  const ClubName = route?.params?.ClubName || '';

  const getAllTess = async () => {
    try {
      const url = API.TEES_BY_HOLEID;
      const params = {
        holeId:HoleId
      };
      const result = await postAuth(url, params)
        .then(data => {
          setTees(data?.data);
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
      getAllTess();
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


  const _onClickCourceDetails = item => {
    alert(item)
    // navigation.navigate('PayingCart')
 //  navigation.navigate('PayingCart',{HolePointName:item.name,ClubName:ClubName})
  };

  return (
    <View style={{flex: 1}}>
      <Header
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={'Tees'}
        backIcon={true}
      />
      {isLoading && <Loader />}
      <View style={styles.container}>
      <CourseDetailHeader
          leftImg={images.LeftCourceImg}
          navigation={navigation}
         courceName={CourseName}
          holeName={HoleNumberParNumber}
          golfPointImg={images.golfPoint}
          golfPointImgColor={'#7B7887'}
          titleColor={'#1D1A0C'}
          titleSize={12}
          title={HoleNumberParNumber}
          screenTitle={'Tees'}
        />
        <TeeCartCheckout
          // courceData={imageData}
          courceData={tees}
          // courceData={data.sections}
          onPressList={_onClickCourceDetails}
        />
      </View>
    </View>
  );
};

export default CourceCart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
