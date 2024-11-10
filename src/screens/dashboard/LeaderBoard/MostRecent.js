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

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const MostRecent = ({navigation, mostRecentData, onPressList}) => {

  
  const renderItem = ({item, index}) => {
    const isLastItem = index === mostRecentData.length - 1;

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
      <View
        style={[
          styles.metricBoxInside,
          {height: 115, marginTop: MARGIN.MARGIN_1, paddingVertical: 8},
        ]}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: '100%',
            justifyContent: 'space-around',
          }}>
          <Text style={styles.listTitle}>Saginaw Country Club</Text>
          <Text style={styles.listPrice}>Saginaw, MI</Text>
          <Text style={styles.listPrice}>Hole #10, Par 3</Text>
          <Text style={styles.listPrice}>Black Tees (157 yards)</Text>
        </View>
        <View style={[styles.activeStatus, {paddingHorizontal: 10}]}>
          <FontAwesome5
            name="golf-ball"
            size={13}
            style={{right: 2}}
            color={'#07CE6F'}
          />
          <Text style={[styles.activeText, {color: '#07CE6F', left: 2}]}>
            {' Open'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
            height: '100%',
            justifyContent: 'space-around',
          }}>
          <Text style={styles.listTitle}>Closest-to-the-Pin</Text>
          <Text style={styles.listPrice}>Entry Fee: $10.00</Text>
          <Text style={styles.listPrice}>Players: 10</Text>
          <Text style={styles.listPrice}>Total Prize: 100</Text>
          <Text style={styles.listPrice}>{'Payout: (80/15/5)'}</Text>
        </View>
      </View>
      <FlatList
        data={mostRecentData}
        contentContainerStyle={{
          margin: 12,
        }}
        keyExtractor={item => item.pos.toString()}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PlayerLeaderboard', {
                imageData: mostRecentData,
              })
            }
            style={{height: 45, paddingVertical: 8, justifyContent: 'center'}}>
            <Text
              style={[
                styles.listTitle,
                {
                  fontSize: 13,
                  color: '#07CE6F',
                  textDecorationLine: 'underline',
                },
              ]}>
              See full leaderboard
            </Text>
          </TouchableOpacity>
        )}
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
});

export default MostRecent;
