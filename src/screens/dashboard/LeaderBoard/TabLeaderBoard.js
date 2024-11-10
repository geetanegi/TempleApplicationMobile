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
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  WEIGHT,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT} from '../../../global/theme';
import AppText from '../../../components/AppText';
import AntDesign from 'react-native-vector-icons/AntDesign';

const TabLeaderBoard = ({navigation, onPressTab, selectedHeaderTab}) => {

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);


  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _onTabClick = data => {
    onPressTab(data);
  };

  // const _menuClick = data => {
  //   console.log('_modalOpen_inner_screen-->', data);
  //   onFliterClick(data);
  // };

  return (
    <View style={styles.container}>
      {/* <CustomTextComponent title={'Highlight hub'} style={styles.ruleTxt} /> */}
      <View style={{flexDirection: 'row', width: '100%'}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{width: '100%'}}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedHeaderTab === 'ActiveContest' && styles.activeTab,
              ]}
              onPress={() => _onTabClick('ActiveContest')}>
              <Image
                source={images.trophy}
                style={{
                  width: 14,
                  height: 14,
                  right: 8,
                  tintColor:
                    selectedHeaderTab === 'ActiveContest'
                      ? '#FFF'
                      : colors.PRIMARY_LIGHT_TEXT,
                }}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedHeaderTab === 'ActiveContest' && styles.activeTabText,
                ]}>
                Active Contest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedHeaderTab === 'LiveLeaderBoard' && styles.activeTab,
              ]}
              onPress={() => _onTabClick('LiveLeaderBoard')}>
              <Image
                source={images.trophy}
                style={{
                  width: 14,
                  height: 14,
                  right: 8,
                  tintColor:
                    selectedHeaderTab === 'LiveLeaderBoard'
                      ? '#FFF'
                      : colors.PRIMARY_LIGHT_TEXT,
                }}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedHeaderTab === 'LiveLeaderBoard' &&
                    styles.activeTabText,
                ]}>
                Live LeaderBoard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedHeaderTab === 'MostRecent' && styles.activeTab,
              ]}
              onPress={() => _onTabClick('MostRecent')}>
              <Image
                source={images.trophy}
                style={{
                  width: 14,
                  height: 14,
                  right: 8,
                  tintColor:
                    selectedHeaderTab === 'MostRecent'
                      ? '#FFF'
                      : colors.PRIMARY_LIGHT_TEXT,
                }}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedHeaderTab === 'MostRecent' && styles.activeTabText,
                ]}>
                Most Recent
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          paddingVertical: 8,
        }}>
        <View
          style={[
            styles.activeDot,
            {
              backgroundColor:
                selectedHeaderTab === 'ActiveContest' ? '#07CE6F' : '#E6E6E6',
            },
          ]}
        />
        <View
          style={[
            styles.activeDot,
            {
              marginHorizontal: 15,
              backgroundColor:
                selectedHeaderTab === 'LiveLeaderBoard' ? '#07CE6F' : '#E6E6E6',
            },
          ]}
        />
        <View
          style={[
            styles.activeDot,
            {
              backgroundColor:
                selectedHeaderTab === 'MostRecent' ? '#07CE6F' : '#E6E6E6',
            },
          ]}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical:5
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: colors.PRIMARY_SMALL_TEXT,
    borderRadius: 16,
    height: 32,
    elevation: 1,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F5F6F7',
    paddingHorizontal: 20,
    // paddingLeft:5,
    elevation: 1,
    marginHorizontal: 5,
  },
  activeTab: {
    flexDirection: 'row',
    elevation: 1,
    marginVertical: 5,
    width: 137,
    paddingHorizontal: 20,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#07CE6F',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  tabText: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 0.2,
    fontWeight: '400',
    lineHeight: 19.1,
    top: -1,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 19.1,
    letterSpacing: 0.2,
    top: -1,
    fontWeight: '400',
  },
  cardContainer: {
    padding: 15,
    borderBottomColor: '#E6E6E6',
  },

  metricsContainer: {
    paddingVertical: 10,
  },

  image: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
  },
  activeDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    paddingVertical: PADDING.PADDING_10,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
    color: colors.black,
  },
});
export default TabLeaderBoard;
