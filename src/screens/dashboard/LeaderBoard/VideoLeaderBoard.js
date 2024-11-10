import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import AppText from '../../../components/AppText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FloatingOptionModal from './Modals/FloatingOptionModal';

const VideoLeaderBoard = ({
  navigation,
  filter,
  imageData,
  onPressItem,

  onFliterClick,
  modalVisible,

  onRequestModalClick,
  modalRequestVedioVisible,

}) => {

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _onClick = data => {
    onPressItem(data);
  };

  const _modalOpen = data => {
    onFliterClick(data);
  };

  const _menuClick = data => {
    onFliterClick(data);
  };


  const _requestVedioModal = data => {
    // alert("call")
    console.log("_requestVedioModal-inside function->",data);

    onRequestModalClick(data);
  };


  
//console.log("modalRequestVedioVisible-inside listing->",modalRequestVedioVisible);

  const renderItem = ({item}) => (
    <View style={[styles.imageContainer]}>
      <Image
        source={{
          uri: 'https://www.shutterstock.com/image-photo/front-view-golfer-driver-back-260nw-2446559499.jpg',
        }}
        style={styles.image}
      />
      {filter ? (
        <TouchableOpacity
          onPress={() => _menuClick(modalVisible)}
          style={[styles.iconContainer]}>
          <Image source={images.menuIcon} style={styles.menu} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.iconContainer}>
          <Image source={images.lockIcon} style={styles.lock} />
        </TouchableOpacity>
      )}
      {modalVisible && (
        <FloatingOptionModal
          modalVisible={modalVisible}
          onPress={() => _modalOpen(modalVisible)}
        />
      )}
      {modalRequestVedioVisible && (
        <VedioRequestModal
          modalRequestVedioVisible={modalRequestVedioVisible}
          onPressRequestVedio={() =>
            _requestVedioModal(modalRequestVedioVisible)
          }
        />
      )}
      {filter && (
        <View style={styles.timerContainer}>
          <CustomTextComponent title={'8:15'} style={styles.timerText} />
        </View>
      )}
      <View style={styles.metricBox}>
        <View style={{flexDirection: 'column'}}>
          <CustomTextComponent
            title={'Michael DeTizio'}
            style={styles.overviewTitle}
          />
          <CustomTextComponent
            title={'Hole-in-One'}
            style={styles.overviewValue}
          />
        </View>
        {filter ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => _onClick('like')}
              style={{right: 10}}>
              <AntDesign name={'like2'} size={16} color={colors.BLUE_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _onClick('share')}>
              <Feather name={'share-2'} size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => _requestVedioModal(modalRequestVedioVisible)}
            // onPressRequestVedio={() =>
            //   _requestVedioModal(modalRequestVedioVisible)
            // }
            // onPress={() => _onClick('requestVedio')}
          >
            <Image
              source={
                item.vediRequest === 'REQUEST'
                  ? images.requestVedioIcon
                  : item.vediRequest === 'PENDING'
                  ? images.pendingRequest
                  : images.re_Request
              }
              style={
                item.vediRequest === 'REQUEST'
                  ? styles.requestVedio
                  : item.vediRequest === 'PENDING'
                  ? styles.pendingReq
                  : styles.re_RequestImg
              }
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.teeDetails}>
        <CustomTextComponent title={'53K Views'} style={styles.pointName} />
        <View style={styles.dot} />
        <CustomTextComponent title={'12 Likes'} style={styles.pointName} />
        <View style={styles.dot} />
        <CustomTextComponent title={'01/10/2024'} style={styles.pointName} />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <FlatList
          horizontal={false}
          data={imageData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{flex: 1}}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {},
  cardContainer: {
    marginHorizontal: 20,
  },
  metricBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    width: WIDTH.WIDTH_100,
  },
  overviewTitle: {
    fontSize: SIZES.SIZES_13,
    fontWeight: WEIGHT.WEIGHT_400,
    color: colors.DISABLE,
    fontFamily: family.regular,
  },
  overviewValue: {
    fontSize: SIZES.SIZES_16,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.white,
    fontFamily: family.regular,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  timerContainer: {
    position: 'absolute',
    top: 150,
    right: 10,
  },
  menu: {
    width: 24,
    height: 24,
  },
  lock: {
    width: 36,
    height: 36,
  },
  requestVedio: {
    width: 103,
    height: 20,
  },
  pendingReq: {
    width: 70,
    height: 20,
  },
  re_RequestImg: {
    width: 121,
    height: 20,
  },
  dot: {
    height: 6,
    width: 6,
    backgroundColor: 'gray',
    borderRadius: 3,
    marginHorizontal: 10,
  },
  teeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: WIDTH.WIDTH_100,
    padding: 10,
    paddingHorizontal: 15,
  },
  pointName: {
    fontSize: 12,
    fontWeight: WEIGHT.WEIGHT_300,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
  },
  timerText: {
    fontSize: 10,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.white,
    fontFamily: family.regular,
    backgroundColor: colors.BG_LIGHT_TRANSPARENT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    letterSpacing: 2,
  },
});
export default VideoLeaderBoard;
