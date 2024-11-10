import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Animated,
  Platform,
  UIManager,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useRef} from 'react';
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
import SubHeader from './SubHeader';
import HeaderHome from '../../../components/HeaderHome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const PlayerLeaderboard = ({navigation, route, onPressList}) => {
  const _imageData = route?.params?.imageData || '';
  const renderItem = ({item, index}) => {
    const isLastItem = index === _imageData.length - 1;

    return (
      <View style={[styles.row, isLastItem && styles.lastItem]}>
        <Text style={[styles.proximity, {width: '10%'}]}>{item.pos}</Text>
        <View style={styles.usernameContainer}>
          <Image source={images.user} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.username}</Text>
          </View>
        </View>
        <Text style={[styles.proximity, {width: '35%'}]}>{item.proximity}</Text>
        <Text style={[styles.proximity, {width: '15%'}]}>{item.prize}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderHome
        drawerIcon={true}
        playerImage={images.user}
        navigation={navigation}
        playerName={'MeTizio'}
        GHIN={'2460170'}
        HDCP={'1.5'}
      />
      <View style={{height: 60, paddingVertical: 8, paddingHorizontal: 15}}>
        <SubHeader navigation={navigation} />
      </View>
      <FlatList
        data={_imageData}
        contentContainerStyle={{
          marginHorizontal: 12,
        }}
        keyExtractor={item => item.pos.toString()}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.headerText, {width: '10%'}]}>Pos</Text>
            <Text style={[styles.headerText, {width: '40%'}]}>Username</Text>
            <Text style={[styles.headerText, {width: '35%'}]}>
              Proximity (FEET)
            </Text>
            <Text style={[styles.headerText, {width: '15%'}]}>Prize</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH.WIDTH_100,
    height: HEIGHT.HEIGHT_100,
    // backgroundColor:'black'
  },
  metricBoxInside: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_95,
    height: SIZES.SIZES_87,
    marginTop: MARGIN.MARGIN_15,
    marginHorizontal: MARGIN.MARGIN_10,
    paddingHorizontal: SIZES.SIZES_10,
    borderRadius: RADIUS.RADIUS_6,
    backgroundColor: '#07CE6F',
    elevation: ELEVATION.ELEVATION_8,
  },

  listTitle: {
    fontSize: FONTSIZE.FONTSIZE_13,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  listPrice: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  activeStatus: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: '#191818',
    borderRadius: RADIUS.RADIUS_4,
    height: SIZES.SIZES_22,
    paddingHorizontal: 3,
  },
  activeText: {
    color: colors.white,
    fontSize: FONTSIZE.FONTSIZE_10,
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#0075AA',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07CE6F',
    borderTopWidth: 0.5,
    borderTopColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: '100%',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  usernameContainer: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  proximity: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  username: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    left: 5,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
  },
  lastItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  leftImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
    // backgroundColor:'red'
  },
});

export default PlayerLeaderboard;
