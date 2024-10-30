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

import React, { useState, useRef, useEffect } from 'react';
import st from '../../../global/styles';
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
import { colors, images, APP_TEXT, NAVIGATION } from '../../../global/theme';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import LoginImg from '../../../components/loginImage';
import { API } from '../../../utils/endpoints';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';

import CourseDetailHeader from '../../../components/CourseDetailHeader';
import PlayingCartCheckout from '../../../components/PlayingCartCheckout';
import ButtonCheckout from '../../../components/ButtonCheckout';
import AppText from '../../../components/AppText';
//LeftCourceImg

const data = {
  sections: [
    {
      id: '1',
      name: 'Blue Tees (157 Yards)',
      value: 5,
      accordianItem: [
        { id: '11', name: 'Closest-to-Pin', price: 5, date: 'Jan 10 - Feb 10' },
        { id: '12', name: 'Hole-in-One', price: 13, date: 'Jan 15 - Feb 12' },
      ],
    },
  ],
};

const PayingCart = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { label: 'Credit Card', value: 'option1' },
    { label: 'Wallet', value: 'option2' },
  ];
  const HolePointName = route?.params?.HolePointName || '';
  const ClubName = route?.params?.ClubName || '';

  const _onClickCheckOut = () => {
    alert('call');

    const localDate = new Date(); // Get the current date
  const utcDate = localDate.toISOString();
    const requestJSON = {
      playerId: 1,
      registrationDate: utcDate,
      totalAmount: 400,
      cartInfo: [
        // {
        //     "scheduleContestId": 1,
        //     "amount": 200
        // },
        // {
        //     "scheduleContestId": 1,
        //     "amount": 200
        // }
      ],
      payment: {
        paymentMethod: "CARD",
        paymentStatus: "SUCCESS",
        transactionId: "@121222"
      }
    }
    console.log('----requestJSON---',requestJSON)

  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header
        leftImg={'cart'}
        navigation={navigation}
        title={'Playing Cart'}
        backIcon={false}
      />

      {isLoading && <Loader />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <Text
          style={[st.headerLeftTitle, { alignSelf: 'flex-start', padding: 15 }]}>
          {'Playing Cart'}
        </Text>
        <View style={{ top: -15, left: -15 }}>
          <CourseDetailHeader
            leftImg={images.LeftCourceImg}
            navigation={navigation}
            courceName={ClubName}
            golfPointImg={images.golfPoint}
            golfPointImgColor={'#7B7887'}
            titleColor={'#1D1A0C'}
            titleSize={12}
            title={HolePointName}
            screenTitle={'Tees'}
          />
        </View>
        <PlayingCartCheckout courceData={data.sections} />
        <View style={styles.paymentView}>
          <AppText style={styles.title}>Payment Method</AppText>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionContainer}
              onPress={() => setSelectedOption(option.value)}>
              <View style={styles.radioCircle}>
                {selectedOption === option.value && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}

          <ButtonCheckout onPressCheckout={_onClickCheckOut} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PayingCart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  paymentView: {
    margin: MARGIN.MARGIN_15,
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
    padding: SIZES.SIZES_20,
    borderRadius: SIZES.SIZES_6,
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginVertical: 10,
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.BORDER_GREY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.BLUE_COLOR,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.PRIMARY_DARK
  },
});
