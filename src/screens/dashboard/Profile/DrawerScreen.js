import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, images} from '../../../global/theme';
import DrawerHeader from '../../../components/DrawerHeader';
import Feather from 'react-native-vector-icons/Feather'; // Import icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
import PopUpMessage from '../../../components/popup';
import {clearLogin} from '../../../redux/reducers/Login';
import {cleanLogindata} from '../../../redux/reducers/Logindata';
import {useDispatch} from 'react-redux';
import {Film} from 'lucide-react-native';
import SecondaryHeader from '../../../components/Header/secondaryHeader';

const DrawerScreen = ({navigation}) => {
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [twoButton, setTwoButton] = useState(false);
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const dispatch = useDispatch();

  const DATA = [
    // { id: '1', title: 'Highlight Hub', icon: 'film' },
    // {id: '2', title: 'Home Course', icon: 'settings-outline'},
    // {id: '3', title: 'Friends', icon: 'person-outline'},
    // {id: '4', title: 'Squads', icon: 'mail-outline'},
    // {id: '5', title: 'Messages', icon: 'notifications-outline'},
    // {id: '6', title: 'Champions League', icon: 'help-circle-outline'},
  ];

  const navigationRouting = title => {
    if (title === 'Highlight Hub') {
      navigation.navigate('HighlightHubScreen'); // You can define these screens in your Stack or Drawer Navigator
    } else if (title === 'Home Course') {
      navigation.navigate('HomeScreen'); // Or navigate to any other screen you need
    } else {
      // Handle other routes
    }
  };
  // HighlightHub

  const Item = ({title, icon}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigationRouting(title)}
      style={styles.item}>
      {/* <AntDesign
        name="shoppingcart"
        size={SIZES.SIZES_24}
        color={colors.grey}
      /> */}
      {/* <Film source={images.LeftCourceImg}/> */}
      <Film
        strokeWidth={1}
        style={{
          color: colors.ICON_GREY,
        }}
        size={32}
      />

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );

  const handleBackPress = () => {
    openPopupMessage('Warning', `Are you sure you want to logout?`, true);
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
          navigation.closeDrawer();
          dispatch(clearLogin());
          dispatch(cleanLogindata());
        }}
        onPressNoBtn={() => {
          navigation.closeDrawer();
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
  const settingsOptions = [
    {id: '1', label: 'Account', icon: 'person'},
    {id: '2', label: 'Support', icon: 'headset-mic'},
    {id: '3', label: 'Privacy Policy', icon: 'lock'},
    {id: '4', label: 'Terms & Condition', icon: 'gavel'},
    {id: '5', label: 'Configuration', icon: 'settings'},
  ];

  return (
    <View style={styles.container}>
      {/* <DrawerHeader
        navigation={navigation}
        backIcon={false}
        title={'Michael DeTizio'}
      /> */}
      <SecondaryHeader
        textLeft
        title={'Settings'}
        navigate={navigation.closeDrawer}
      />
      {/* <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} icon={item.icon} />}
        keyExtractor={item => item.id}
      /> */}
      {/* <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => handleBackPress()}>
        <View style={styles.signOutContainer}>
          <Feather name="log-out" size={20} color={colors.black} />
          <Text style={[styles.title]}>Log Out</Text>
        </View>
      </TouchableOpacity> */}
      {show_alert_msg()}
      <FlatList
        data={settingsOptions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SettingItem
            icon={item.icon}
            label={item.label}
            onPress={() => console.log(item.label + ' pressed')}
          />
        )}
      />
    </View>
  );
};

const SettingItem = ({icon, label, onPress}) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={20} color={colors.white} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Icon
        name="chevron-right"
        size={22}
        color={colors.DARK_GREY}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 16,
  },
  signOutButton: {
    position: 'absolute',
    bottom: 0,
    height: 46,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderTopColor: colors.PRIMARY_LIGHT_TEXT,
    borderTopWidth: 0.5,
  },
  signOutContainer: {
    flexDirection: 'row',
  },
  signOutText: {
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginRight: 16,
  },

  title: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.black,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    marginLeft: 15,
  },
  golfIcon: {
    tintColor: colors.PRIMARY_DARK,
    width: 18,
    height: 18,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f77f00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    marginLeft: 10,
  },
});
export default DrawerScreen;
