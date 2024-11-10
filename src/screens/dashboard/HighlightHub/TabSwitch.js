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
import FloatingFilterModal from './Modals/FloatingFilterModal';


const TabSwitch = ({
  navigation,
  onPressTab,
  selectedHeaderTab,
  filter,
  onFliterClick,
  modalVisible,
}) => {
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _onTabClick = data => {
    onPressTab(data);
  };

  const _menuClick = data => {
    console.log('_modalOpen_inner_screen-->', data);
    onFliterClick(data);
  };

  return (
    <ScrollView style={styles.container}>
      <CustomTextComponent title={'Highlight hub'} style={styles.ruleTxt} />
      <View style={{flexDirection: 'row', width: '100%'}}>
        <View style={{width: '90%'}}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedHeaderTab === 'Published' && styles.activeTab,
              ]}
              onPress={() => _onTabClick('Published')}>
              <Image
                source={images.publishIcon}
                style={{
                  width: 14,
                  height: 14,
                  right: 8,
                  tintColor:
                    selectedHeaderTab === 'Published'
                      ? '#FFF'
                      : colors.PRIMARY_LIGHT_TEXT,
                }}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedHeaderTab === 'Published' && styles.activeTabText,
                ]}>
                Published
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedHeaderTab === 'Request' && styles.activeTab,
              ]}
              onPress={() => _onTabClick('Request')}>
              <Image
                source={images.publishIcon}
                style={{
                  width: 14,
                  height: 14,
                  right: 8,
                  tintColor:
                    selectedHeaderTab === 'Request'
                      ? '#FFF'
                      : colors.PRIMARY_LIGHT_TEXT,
                }}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedHeaderTab === 'Request' && styles.activeTabText,
                ]}>
                Request
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedHeaderTab === 'All' && styles.activeTab,
              ]}
              onPress={() => _onTabClick('All')}>
              <Image
                source={images.publishIcon}
                style={{
                  width: 14,
                  height: 14,
                  right: 8,
                  tintColor:
                    selectedHeaderTab === 'All'
                      ? '#FFF'
                      : colors.PRIMARY_LIGHT_TEXT,
                }}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedHeaderTab === 'All' && styles.activeTabText,
                ]}>
                All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            width: '10%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {filter && (
            <TouchableOpacity 
            onPress={() => _menuClick(modalVisible)}
            style={{width: 20, height: 20}}>
              <AntDesign name={'filter'} size={18} color={colors.BLUE_COLOR} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {modalVisible && (
        <FloatingFilterModal
          modalVisible={modalVisible}
          onPress={() => _menuClick(modalVisible)}
        />
      )}

      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginBottom: 45,
          marginTop: 8,
        }}>
        <View
          style={[
            styles.activeDot,
            {
              backgroundColor:
                selectedHeaderTab === 'Published' ? '#0077B6' : '#E6E6E6',
            },
          ]}
        />
        <View
          style={[
            styles.activeDot,
            {
              marginHorizontal: 15,
              backgroundColor:
                selectedHeaderTab === 'Request' ? '#0077B6' : '#E6E6E6',
            },
          ]}
        />
        <View
          style={[
            styles.activeDot,
            {
              backgroundColor:
                selectedHeaderTab === 'All' ? '#0077B6' : '#E6E6E6',
            },
          ]}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5F6F7',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 3,
  },
  tabButton: {
    flexDirection: 'row',
    width: '32%',
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
  },
  activeTab: {
    flexDirection: 'row',
    elevation: 1,
    marginVertical: 5,
    width: '32%',
    height: 24,
    borderRadius: 12,
    backgroundColor: '#95C11E',
    alignItems: 'center',
    justifyContent: 'center',
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
export default TabSwitch;
