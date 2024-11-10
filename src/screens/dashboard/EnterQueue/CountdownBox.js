import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Button,
  Pressable,
  TouchableOpacity,
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
import {API} from '../../../utils/endpoints';
import {postAuth} from '../../../utils/apicalls/postApi';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import Header from '../../../components/Header';
import AppText from '../../../components/AppText';
import PlayerComponent from '../../../components/PlayerComponent';
import ButtonCheckout from '../../../components/ButtonCheckout';
import TeeBoxResult from './TeeBoxResult';
import RecordResults from './RecordYourResult';
import HitTheGreen from './HitTheGreen';
import AccessVedioRequestModal from './AccessVedioRequestModal';
import AchievementScreen from './AchievmentScreen';
import BadgeScreenModal from './BadgeScreenModal';
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
];

const CountdownBox = ({navigation, route}) => {
  const queueCount = route.params.queueCount;
  const [recordResultData, setRecordResultData] = useState('');
  const [hitTheGreenData, setHitTheGreenData] = useState('');
  const [achievementData, setAchievementData] = useState('');

  const [accessVedioRequestModal, setAccessVedioRequestModal] = useState('');

  HitTheGreen;
  const [seconds, setSeconds] = useState(28); // Initial countdown value
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);

  let timer;

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup interval on component unmount
    }
    if (seconds == 0) {
      // navigation.navigate('TeeBoxResults')
      // setModalVisible(true);
      console.log('-hello--');
    }
  }, [seconds]);
  //        <Text style={[styles.readyText, seconds > 0 && { color: '#555' }]}>YES, I'M READY TO HIT</Text>

  const startTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setMessage('Timeout completed!');
    }, 3000);
  };

  const handleSubmit = (val) => {
    if (val === true && seconds == 0) {
      setModalVisible(true);
    } else {
      console.log('Swipe again');
    }
  };

  const onClose = () => {
    setModalVisible(!modalVisible);
    setTimeout(() => {
      setModalVisible1(true);
    }, 500);
  };
  const onClose1 = data => {
    setRecordResultData(data);
    // alert(data)
    console.log('recordResultData-->', data);
    // comment belove code to handle the data otherwise next pop will be open
    setModalVisible1(!modalVisible1);
    setTimeout(() => {
      setModalVisible2(true);
    }, 500);
  };
  const onClose2 = data => {
    setHitTheGreenData(data);
    console.log('hitTheGreenData-->', data);
    setModalVisible2(!modalVisible2);
    setTimeout(() => {
      setModalVisible3(true);
    }, 500);
  };

  const onClose3 = data => {
    setAchievementData(data);
    console.log('achievementData-->', data);
    setModalVisible3(!modalVisible3);
    setTimeout(() => {
      setModalVisible4(true);
    }, 500);
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

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  return (
    <View style={styles.parentContainer}>
      <Header
        drawerIcon={false}
        navigation={navigation}
        backIcon={false}
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
          <TeeBoxResult onPress={onClose} />
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
          <AccessVedioRequestModal onPress={onClose4} />
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
          playerName="MeTizio"
          clubName="Saginaw Country Club"
          holeName="Hole #10, Par 3"
          teeName="Black Tees (157 yards))"
        />

        <View
          style={{
            flexDirection: 'row',
            marginVertical: SIZES.SIZES_30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomTextComponent
            title={'MeTizio'}
            style={[
              styles.welcome,
              {
                fontSize: FONTSIZE.FONTSIZE_20,
                color: colors.PRIMARY_DARK,
                fontWeight: WEIGHT.WEIGHT_700,
              },
            ]}
          />
          <CustomTextComponent
            title={' is on the tee'}
            style={[
              styles.welcome,
              {
                fontSize: FONTSIZE.FONTSIZE_18,
                color: colors.PRIMARY_DARK,
                top: SIZES.SIZES_3,
              },
            ]}
          />
        </View>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.welcome, {fontSize: SIZES.SIZES_16}]}>
              {' '}
              You must wait :
            </Text>
            <Text style={[styles.boldText, seconds > 0 && {color: '#555'}]}>
              {'[ ' + seconds + ' seconds ]'}
            </Text>
            <Text style={[styles.welcome, {fontSize: 16}]}>
              before being able to hit
            </Text>
          </View>
        </View>
        <CustomTextComponent
          title={'YES, I’M READY TO HIT'}
          style={[
            styles.welcome,
            {
              fontSize: FONTSIZE.FONTSIZE_18,
              color: colors.PRIMARY_DARK,
              marginVertical: SIZES.SIZES_30,
            },
          ]}
        />

        <View style={[styles.BtnContainer]}>
          <SwipeButton
            lockBtn={seconds === 0 ? false : true}
            onPressMove={handleSubmit}
          />

          {/* <ButtonCheckout
            title="Move"
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
    flex: SIZES.SIZES_1,
    backgroundColor: '#FFFFFF',
  },
  container: {
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
    marginHorizontal: SIZES.SIZES_15,
    paddingBottom: SIZES.SIZES_150,
  },
  welcome: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  centeredView: {
    width: WIDTH.WIDTH_100,
    alignItems: 'center',
  },
  modalView: {
    alignItems: 'center',
    width: WIDTH.WIDTH_80,
    padding: SIZES.SIZES_15,
    borderRadius: SIZES.SIZES_8,
    borderWidth: SIZES.SIZES_1,
    borderColor: colors.COLOR_BORDER,
  },
  boldText: {
    fontWeight: WEIGHT.WEIGHT_700,
    fontSize: SIZES.SIZES_24,
    color: colors.PRIMARY_DARK,
  },
  centeredVieww: {
    flex: 1,
    backgroundColor: colors.TRANSPARENT_BACKGROUNG,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CountdownBox;
