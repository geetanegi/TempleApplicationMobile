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
} from 'react-native';

import React, {useState, useRef, useEffect} from 'react';
import st from '../../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {useDispatch, useSelector} from 'react-redux';

import LoginImg from '../../../components/loginImage';
import {API} from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';

const HomeDashBoard = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);

  const HolePointName = 'Hole #7 - Par 3';
  const ClubName = 'Saginaw Country Club';

  const _onClickCourceDetails = () => {
    navigation.navigate('PayingCart', {
      HolePointName: HolePointName,
      ClubName: ClubName,
    });
  };
 
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => _onClickCourceDetails()}
        style={styles.Button}>
        <Text>Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeDashBoard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  Button: {
    backgroundColor: colors.BACKGROUD_GREY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 130,
    borderRadius: 10,
  },
});
