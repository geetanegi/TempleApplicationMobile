import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../global/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PopUpMessage from '../../../components/popup';
import {clearLogin} from '../../../redux/reducers/Login';
import {cleanLogindata} from '../../../redux/reducers/Logindata';
import {useDispatch} from 'react-redux';

const DrawerScreen = ({navigation}) => {
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState('');
  const [twoButton, setTwoButton] = useState(false);
  const [popupMessageVisibility, setPopupMessageVisibility] = useState(false);
  const dispatch = useDispatch();

  const handleBackPress = () => {
    openPopupMessage('Warning', `Are you sure you want to logout?`, true);
    return true;
  };

  const performLogout = async () => {
    navigation.closeDrawer();
    await AsyncStorage.removeItem('token');
    dispatch(cleanLogindata());
    dispatch(clearLogin());
  };

  const show_alert_msg = () => {
    return (
      <PopUpMessage
        display={popupMessageVisibility}
        titleMsg={title}
        subTitle={subtitle}
        twoButton={twoButton}
        onModalClick={() => {
          performLogout();
          setPopupMessageVisibility(false);
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
    { id: '1', label: 'Account', icon: 'person', screen: 'AccountScreen' },
    { id: '2', label: 'Feedback', icon: 'feedback', screen: 'FeedbackScreen' },
    { id: '3', label: 'Support', icon: 'headset-mic', screen: 'SupportScreen' },
    { id: '4', label: 'Privacy Policy', icon: 'lock', screen: 'PrivacyPolicyScreen' },
    { id: '5', label: 'Terms & Condition', icon: 'gavel', screen: 'TermsAndConditionScreen' },
    { id: '6', label: 'Configuration', icon: 'settings', screen: 'ConfigurationScreen' },
    { id: '7', label: 'YouTube Videos', icon: 'play-circle-outline', screen: 'YouTubeVideosScreen' },
    { id: '8', label: 'Logout', icon: 'logout', screen: null },
  ];

  const onSettingPress = (item) => {
    if (item.label === 'Logout') {
      handleBackPress();
      return;
    }
    if (item.screen) {
      navigation.closeDrawer();
      navigation.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <View style={styles.container}>
        <Pressable
          style={styles.closeButton}
          onPress={navigation.closeDrawer}
          hitSlop={12}
        >
          <Icon name="arrow-back" size={26} color={colors.DARK_BLACK} />
        </Pressable>
        {show_alert_msg()}
        <FlatList
          data={settingsOptions}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <SettingItem
              icon={item.icon}
              label={item.label}
              onPress={() => onSettingPress(item)}
              isLogout={item.label === 'Logout'}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const SettingItem = ({icon, label, onPress, isLogout}) => {
  return (
    <Pressable
      style={({pressed}) => [styles.itemContainer, pressed && styles.itemPressed]}
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, isLogout && styles.iconWrapperLogout]}>
        <Icon name={icon} size={20} color={colors.white} />
      </View>
      <Text style={[styles.label, isLogout && styles.labelLogout]}>{label}</Text>
      {!isLogout && (
        <Icon
          name="chevron-right"
          size={22}
          color={colors.DARK_GREY}
          style={styles.arrow}
        />
      )}
    </Pressable>
  );
};

const SIDEBAR = {
  bg: '#F5F3EF',
  cardBg: '#FFFFFF',
  cardRadius: 14,
  accent: '#D48A4A',
  logout: colors.indian_red || '#A4353D',
  text: '#1B1B1B',
  textMuted: '#6B6B6B',
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: SIDEBAR.bg,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 16 : 8,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  listContent: {
    paddingTop: 56,
    paddingBottom: 32,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SIDEBAR.cardBg,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: SIDEBAR.cardRadius,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  itemPressed: {
    opacity: 0.88,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SIDEBAR.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: SIDEBAR.text,
  },
  arrow: {
    marginLeft: 8,
    opacity: 0.7,
  },
  iconWrapperLogout: {
    backgroundColor: SIDEBAR.logout,
  },
  labelLogout: {
    color: SIDEBAR.logout,
    fontWeight: '700',
  },
});
export default DrawerScreen;
