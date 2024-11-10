import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
  Modal,
} from 'react-native';

import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  Alert,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {API} from '../../../utils/endpoints';
import {postAuth} from '../../../utils/apicalls/postApi';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import PlayerComponent from '../../../components/PlayerComponent';
import ButtonCheckout from '../../../components/ButtonCheckout';
import AccessVedioRequestModal from './AccessVedioRequestModal';
import HitTheGreen from './HitTheGreen';
import RecordResults from './RecordYourResult';
import TeeBoxResults from './TeeBoxResult';
import {ConciergeBell} from 'lucide-react-native';
import AchievementScreen from './AchievmentScreen';
import BadgeScreenModal from './BadgeScreenModal';
import { convertdateinUTC, getUserId } from '../../../redux/store/getState';
import { addPlayertoQueue, checkQueueCount, saveRecordResult } from '../../../utils/apicalls/QueueHandle';
import SwipeButton from '../home/Test';

const IMAGE_DATA = [
  {id: '1', uri: 'https://via.placeholder.com/150'},
  {id: '2', uri: 'https://via.placeholder.com/150'},
  {id: '3', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
];

const TeeBoxContainer = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recordResultData, setRecordResultData] = useState('');

  const CourseName = route?.params?.data?.courseName || '';
  const teeDetaild = route?.params?.data?.teeId || '';
  const holeId = route?.params?.data?.holeId || '';
  const playerCartIds= route?.params?.data?.playerCartIds || [];
 // console.log('---holeId', route?.params);

  const isConnected = useNetworkStatus();
  const [queuecount, setQueueCount] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);

  const onClose = () => {
    setModalVisible(!modalVisible);
    setModalVisible1(true);
  };
  const onClose1 = data => {
    setRecordResultData(data);
    if (data == 'HoleInOne') {
      saveRecord(false,false,true,null,null);
      setModalVisible2(false);
      setModalVisible3(true);
    } else {
      setModalVisible1(!modalVisible1);
      setModalVisible2(true);
    }
  };
  const onClose2 = data => {
    console.log('--proximity---',data)
    setModalVisible2(!modalVisible2);
    setModalVisible3(true);
    console.log('--onClose2-');
  };

  const onClose3 = data => {
   
    if(data===1){
        console.log('--data---',data)
    saveRecord(false,false,true,null,null);
    }
    setModalVisible3(!modalVisible3);
    setTimeout(() => {
      setModalVisible4(true);
    }, 100);
  };

  const onClose4 = data => {
    setModalVisible4(!modalVisible4);
    setTimeout(() => {
      setModalVisible5(true);
    }, 100);
  };

  const onClose5 = data => {
    setModalVisible(false)
    setModalVisible1(false)
    setModalVisible2(false)
    setModalVisible3(false)
    setModalVisible4(false)
    setModalVisible5(false)
    navigation.navigate('BetCentral');
  };


  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().split('.')[0] + 'Z';
  };

  const saveRecord = async (hitGreen,missedGreen,holeInOne,score,proximity) => {
    const todaysDateinUTC = convertdateinUTC();
      const params = {
        cqrIds: CourseName?.playerCartIds,
        recordTime: todaysDateinUTC,
        hitGreen: hitGreen,
        missedGreen: missedGreen,
        holeInOne: holeInOne,
        score: score,
        proximity:proximity,
        isRequested:false
      };
      handleSaveRecordResult(params)
  };

  const handleSaveRecordResult = async (params) => {
    try {
      const courseListData = await saveRecordResult(params);
      if (courseListData?.error) {
        setIsLoading(false);
    } else {
        console.log('---------courseListDtaaaa---',courseListData)
        // setQueueCount(courseListData?.data?.queueCount);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };


  

  const handleAddPlayerToQueue = async (params) => {
    try {
      const courseListData = await addPlayertoQueue(params);
      if (courseListData?.error) {
        setIsLoading(false);
    } else {
        console.log('---------courseListDtaaaa---',courseListData)
        
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };


  const handleQueueCount = async (holeId) => {
    try {
      const courseListData = await checkQueueCount(holeId);
      if (courseListData?.error) {
        setIsLoading(false);
    } else {
        console.log('---------courseListDtaaaa---',courseListData.data?.queueCount)
        setQueueCount(courseListData?.data?.queueCount);
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
      handleQueueCount(holeId);
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

    console.log('---back')
    navigation.navigate('Dashboard');

    return true;
  };

  const addPlayerQue = async () => {
    const todaysDateinUTC = convertdateinUTC();
    const userId= getUserId()
      const params = {
        holeId:holeId,
        teeId: teeDetaild,
        playerId:userId ,
        registrationDate: '2024-10-09',
        playerCartIds: playerCartIds,
      };
      console.log('---params add player quee--',params)
      handleAddPlayerToQueue(params)
  };


  const handleSubmit = (val) => {
    if (val === true) {

    if (queuecount == 0) {
      console.log('if it is 0');
      setModalVisible(true);
      addPlayerQue();
    } else {
      console.log('if it is nottt 0');
      navigation.navigate('CountdownBox', {queueCount: queuecount});
    }
 

  }else{
    console.log('Swipe again');
  }
  };

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  return (
    <View style={styles.parentContainer}>
      <Header
        drawerIcon={false}
        navigation={navigation}
        backIcon={true}
        title={''}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredVieww}>
          <TeeBoxResults onPress={onClose} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          setModalVisible1(!modalVisible1);
        }}>
        <View style={styles.centeredVieww}>
          <RecordResults onPress={onClose1} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredVieww}>
          <HitTheGreen onPress={onClose2} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => {
          setModalVisible3(!modalVisible3);
        }}>
        <View style={styles.centeredVieww}>
          <AchievementScreen onPress={onClose3} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => {
          setModalVisible4(!modalVisible4);
        }}>
        <View style={styles.centeredVieww}>
          <AccessVedioRequestModal navigation={navigation} onPress={onClose4} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible5}
        onRequestClose={() => {
          setModalVisible5(!modalVisible5);
        }}>
        <View style={styles.centeredVieww}>
          <BadgeScreenModal imageData={IMAGE_DATA} onPress={onClose5} />
        </View>
      </Modal>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
        <PlayerComponent
          playerName={CourseName?.firstName}
          clubName={CourseName?.clubName}
          holeName={
            'Hole #' + CourseName?.holeNumber + ' Par ' + CourseName?.par
          }
          teeName={CourseName?.teeName + ' (' + CourseName?.yardage + ' yard)'}
        />

        <CustomTextComponent
          title={APP_TEXT.THE_TEE_BOX_OPEN}
          style={[styles.welcome, {marginTop: SIZES.SIZES_30}]}
        />
        <View style={{flexDirection: 'row'}}>
          <CustomTextComponent
            title={APP_TEXT.PLAYER_IN_QUEUE}
            style={styles.welcome}
          />
          <CustomTextComponent
            title={'  ' + queuecount}
            style={[
              styles.welcome,
              {fontSize: FONTSIZE.FONTSIZE_14, color: colors.PRIMARY_DARK},
            ]}
          />
        </View>
        <CustomTextComponent
          title={APP_TEXT.MAKE_SURE_GREEN_CLEAR}
          style={[
            styles.welcome,
            {
              fontSize: FONTSIZE.FONTSIZE_14,
              color: colors.PRIMARY_DARK,
              marginVertical: SIZES.SIZES_30,
            },
          ]}
        />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.welcome}>
              {APP_TEXT.RULE_TXT1}{' '}
              <Text style={styles.boldText}>3 minutes</Text>
              {APP_TEXT.RULE_TXT}{' '}
              <Text style={styles.boldText}>30 seconds</Text>{' '}
              {APP_TEXT.UNTIL_THE_NEXT}
            </Text>
          </View>
        </View>
        <CustomTextComponent
          title={APP_TEXT.READY_TO_HIT}
          style={[
            styles.welcome,
            {
              fontSize: FONTSIZE.FONTSIZE_14,
              color: colors.PRIMARY_DARK,
              marginVertical: SIZES.SIZES_30,
            },
          ]}
        />

        <View style={[styles.BtnContainer]}>
        <SwipeButton onPressMove={handleSubmit} />
          {/* <ButtonCheckout
            title={APP_TEXT.MOVE_BUTTON}
            onPressCheckout={handleSubmit}
            img={false}
          /> */}
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
    backgroundColor: colors.white,
  },
  container: {
    alignItems: 'center',
  },
  centeredVieww: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomImage: {
    width: SIZES.SIZES_200,
    height: SIZES.SIZES_377,
    position: 'absolute',
    bottom: SIZES.SIZES_140,
  },
  BtnContainer: {
    alignItems: 'center',
    marginHorizontal: MARGIN.MARGIN_15,
    paddingBottom: SIZES.SIZES_150,
  },
  welcome: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginHorizontal: '5%',
    padding: PADDING.PADDING_20,
    borderRadius: RADIUS.RADIUS_8,
    borderWidth: BORDERWIDTH.BORDERWIDTH_1,
    borderColor: colors.COLOR_BORDER,
  },
  boldText: {
    fontWeight: WEIGHT.WEIGHT_700,
    color: colors.black,
  },
});

export default TeeBoxContainer;
