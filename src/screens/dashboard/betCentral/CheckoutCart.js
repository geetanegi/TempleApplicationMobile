import {
  Text,
  Image,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, { useState } from 'react';
import st from '../../../global/styles';
import {
  SIZES,
} from '../../../global/fonts';
import { APP_TEXT, colors, images, NAVIGATION } from '../../../global/theme';
import Loader from '../../../components/loader';
import Header from '../../../components/Header';
import PlayingCartCheckout from '../../../components/PlayingCartCheckout';
import ButtonCheckout from '../../../components/ButtonCheckout';
import RadioButton from '../../../components/RadioButton';
import Toast from 'react-native-simple-toast';
import AppText from '../../../components/AppText';
import PlayingHeader from '../../../components/CourseDetailHeader/PlayingHeader';
import { useFocusEffect } from '@react-navigation/native';
import { convertdateinUTC, getUserId } from '../../../redux/store/getState';
import { SaveCartData } from '../../../utils/apicalls/PlayerCartHandler';
import PopUpMessage from '../../../components/popup';
const options = [
  {
    label: 'Credit Card',
    value: 'CreditCard',
    icon: 'creditcard',
    backgroundClr: 'transparent',
    tintClr: colors.PRIMARY_DARK,
  },
  {
    label: 'Wallet',
    value: 'Wallet',
    icon: 'wallet',
    backgroundClr: colors.PRIMARY_SOLID_TEXT,
    tintClr: colors.white,
  },
];

const PayingCart = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('CreditCard');
  const [selectedCard, setSelectedCard] = useState('ICICI Bank');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [totalPayable, setTotalPayable] = useState(0);
  const contestListData = route?.params?.checkOutItemList || '';
  const courceName = route?.params?.courceName || '';
  const holeName = route?.params?.holeName || '';

  const teeName = contestListData[0].tee?.teeName + ' (' + contestListData[0].tee?.yardage + ') yard'
  const teeId = contestListData[0].tee.id;
  const HoleId = route.params.HoleId;

  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [twoButton, setTwoButton] = useState(false);
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);

  const handleCardNumberChange = text => {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 0) {
      formattedText = formattedText.match(/.{1,4}/g).join(' ');
    }
    setCardNumber(formattedText);
  };

  const handleExpiryDateChange = text => {
    // Add '/' after the second digit
    let formattedText = text.replace(/\D/g, '').slice(0, 4); // Limit to MMYY
    if (formattedText.length >= 3) {
      formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2);
    }
    setExpiryDate(formattedText);
  };

  const handleCvvChange = text => {
    const formattedText = text.replace(/\D/g, '').slice(0, 3); // Limit to 3 digits
    setCvv(formattedText);
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => { };
    }, []),
  );

  const handleBackPress = () => {
      openPopupMessage(
        'Warning',
        `The items added to cart will be lost if you navigate away from this page. Are you sure you want to leave this page?`,
        true,
      );
      return true;
  };

  const show_alert_msg = () => {
    return (
      <PopUpMessage
        display={popupMessageVisibility}
        titleMsg={title}
        subTitle={subtitle}
        twoButton={twoButton}
        onModalClick={value => {
          navigation.navigate(NAVIGATION.TO_COURSESCREEN)
        }}
        onPressNoBtn={() => {
          setPopupMessageVisibility(false);
        }}
      />
    );
  };

  const openPopupMessage = (title, subtitle, isTwoButton) => {
    setTitle(title);
    setSubtitle(subtitle);
    setTwoButton(isTwoButton);
    setPopupMessageVisibility(true);
  };

  const handleSubmit = () => {
    let newAdminList = [];
    contestListData.forEach(user => {
      let data = {
        scheduleContestId: user?.scheduleContestId,
        amount: user?.entryFee
      }
      newAdminList.push(data);
    });
    const todaysDateinUTC = convertdateinUTC();
    const userID = getUserId();
    const requestJSON = {
      playerId: userID,
      registrationDate: todaysDateinUTC,
      holeId: HoleId,
      teeId: teeId,
      totalAmount: totalPayable,
      cartInfo: newAdminList,
      payment: {
        paymentMethod: "CARD",
        paymentStatus: "SUCCESS",
        transactionId: "@121222"
      }
    }
   handleRegistration(requestJSON);
  };

  const handleRegistration = async (registerPlayer) => {
    try {
      const cardData = await SaveCartData(registerPlayer);
      if (!cardData?.error) {
        setIsLoading(false);
        Toast.show(cardData?.data?.message);
        navigation.navigate(NAVIGATION.TO_HOME);
      } else {
        Toast.show(cardData?.description);
      }
    } catch (error) {
      console.error("Error in handleRegistration:", error);
      return null;
    }
  };

  const _onClickRadioOption = selectedItem => {
    setSelectedOption(selectedItem);
  };
  const handleTotalPayableChange = (newTotalPayable) => {
    setTotalPayable(newTotalPayable)
  };


  const renderText = label => {
    return <AppText style={st.title}>{label}</AppText>;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header
        drawerIcon={false}
        leftImg={APP_TEXT.CART_}
        navigation={navigation}
        title={APP_TEXT.PLAYING_CART}
        backIcon={false}
      />
      {isLoading && <Loader />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={st.centerAlign}>
        <Text
          style={[
            st.headerLeftTitle,
            { alignSelf: 'flex-start', padding: SIZES.SIZES_15 },
          ]}>
          {APP_TEXT.PLAYING_CART}
        </Text>
        <View style={{ top: -15, left: -15 }}>
          <PlayingHeader
            leftImg={images.LeftCourceImg}
            navigation={navigation}
            courceName={courceName}
            golfPointImg={images.golfPoint}
            img={images.sports_golf}
            golfPointImgColor={colors.PRIMARY_LIGHT_TEXT}
            titleColor={colors.PRIMARY_DARK}
            titleSize={12}
            title={holeName}
            screenTitle={APP_TEXT.TEES}
            teeName={teeName}

          />
        </View>
        <PlayingCartCheckout
          navigation={navigation}
          courceData={contestListData}
          onTotalPayableChange={handleTotalPayableChange}
        />
        <View style={st.paymentView}>
          {renderText(APP_TEXT.PAYMENT_METHOD)}
          <View style={st.radioparentView}>
            <RadioButton
              selectedOption={selectedOption}
              options={options}
              onPressRadio={_onClickRadioOption}
            />
          </View>
          {selectedOption == 'CreditCard' && (
            <View
              style={[
                st.radioparentView,
                { borderTopColor: colors.grey, borderTopWidth: 1 },
              ]}>
              <TouchableOpacity
                style={st.optionContainer}
                onPress={() => setSelectedCard('ICICI Bank')}>
                <View style={st.radioCircle}>
                  {selectedCard === 'ICICI Bank' ? (
                    <View style={st.selectedCircle} />
                  ) : null}
                </View>
                <View style={st.cardInfo}>
                  <Text style={st.cardTitle}>ICICI Bank Credit Card</Text>
                  <View style={st.cardDetails}>
                    <Text style={st.cardNumber}>**1615</Text>
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
                      }} // Example logo for Mastercard
                      style={st.cardLogo}
                    />
                    <Text style={st.cardHolder}>Michael DeTizio</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Add New Credit Card Option */}
              <TouchableOpacity
                style={st.optionContainer}
                onPress={() => setSelectedCard('Add New')}>
                <View style={st.radioCircle}>
                  {selectedCard === 'Add New' ? (
                    <View style={st.selectedCircle} />
                  ) : null}
                </View>
                <Text style={st.addNewText}>Add New Credit Card</Text>
              </TouchableOpacity>
            </View>
          )}
          {selectedOption == 'CreditCard' && selectedCard === 'Add New' && (
            <View
              style={[
                st.radioparentView,
                // {borderTopColor: colors.grey, borderTopWidth: 1},
              ]}>

              <View style={{ backgroundColor: 'transparent', paddingTop: 25 }}>
                {renderText('Name on Card:')}
                <TextInput
                  style={st.input}
                  autoCorrect={false}
                  placeholderTextColor={colors.PRIMARY_DARK}
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Cardholder Name"
                  keyboardType="numeric"
                  maxLength={19} // 16 digits + 3 spaces
                />
                {renderText('Card Number:')}
                <TextInput
                  style={st.input}
                  autoCorrect={false}
                  placeholderTextColor={colors.PRIMARY_DARK}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 1234 5678"
                  keyboardType="numeric"
                  maxLength={19} // 16 digits + 3 spaces
                />

                {renderText('Expiration Date:')}
                <TextInput
                  autoCorrect={false}
                  placeholderTextColor={colors.PRIMARY_DARK}
                  style={st.input}
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5} // MM/YY
                />

                {renderText('CVV:')}
                <TextInput
                  autoCorrect={false}
                  placeholderTextColor={colors.PRIMARY_DARK}
                  style={st.input}
                  value={cvv}
                  onChangeText={handleCvvChange}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3} // CVV is usually 3 digits
                />
              </View>
            </View>
          )}

          <View style={{ paddingVertical: 25 }}>
            <ButtonCheckout
              title={APP_TEXT.CHECK_OUT}
              onPressCheckout={handleSubmit}
              img={true}
            />
          </View>
        </View>
      </ScrollView>
      {show_alert_msg()}
    </View>
  );
};

export default PayingCart;