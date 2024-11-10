import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, colors} from '../../global/theme';
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
} from '../../global/fonts';
import Icon from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import st from '../../global/styles';
import {useDispatch} from 'react-redux';
import {clearLogin, setLogin} from '../../redux/reducers/Login';
import {SafeAreaView} from 'react-native-safe-area-context';
import {cleanLogindata, setLogindata} from '../../redux/reducers/Logindata';
import AntDesign from 'react-native-vector-icons/AntDesign';
const HeaderHome = ({
  navigation,
  drawerIcon,
  playerImage,
  playerName,
  GHIN,
  HDCP,
}) => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <View style={styles.headerArea}>
        <View style={styles.playerImgArea}>
          <TouchableOpacity>
            <Image source={playerImage} style={styles.profileImage} />
          </TouchableOpacity>

          <View style={styles.playerDetails}>
            <Text style={[st.headerLeftTitle]}>{playerName}</Text>
            <View style={styles.details}>
              <Text style={[styles.pointName]}>{'HDCP :' + HDCP}</Text>
              <View style={styles.ghin} />
              <Text style={[styles.pointName]}>{'GHIN :' + GHIN}</Text>
            </View>
          </View>
        </View>

        <View style={[st.row, st.align_C]}>
          <TouchableOpacity
            style={styles.notify}
            onPress={() => navigation.navigate('Notification')}>
            <Icon name={'bell'} size={24} color={colors.white} />
          </TouchableOpacity>
          {drawerIcon && (
            <TouchableOpacity style={styles.drawerBtn} onPress={toggleDrawer}>
              <SimpleLineIcons
                name={'options-vertical'}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 0.5,
    resizeMode: 'stretch',
  },
  leftImage: {
    width: 24,
    height: 24,
  },
  headerArea: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.grey,
    backgroundColor: colors.white,
  },
  pointName: {
    fontSize: 12,
    fontWeight: WEIGHT.WEIGHT_300,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
  },
  notify: {
    backgroundColor: colors.DARK_GREY,
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  ghin: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.PRIMARY_LIGHT_TEXT,
    marginHorizontal: 10,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerDetails: {marginLeft: 10, flexDirection: 'column'},
  playerImgArea: {flexDirection: 'row', alignItems: 'center'},
  drawerBtn: {
    backgroundColor: colors.DARK_GREY,
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:5,
  },
});
