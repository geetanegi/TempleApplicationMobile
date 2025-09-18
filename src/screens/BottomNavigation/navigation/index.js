import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {APP_TEXT, colors, images} from '../../../global/theme';
import st from '../../../global/styles';

// Screens
import Community from '../../dashboard/community/CommunityList';
import CourceDetails from '../../dashboard/betCentral/HoleScreen';
import CourceCart from '../../dashboard/betCentral/TeeScreen';
import PayingCart from '../../dashboard/betCentral/CheckoutCart';
import ProfilePage from '../../dashboard/Profile/Profilepage';
import EnterQueueHome from '../../dashboard/EnterQueue/EnterQueueHome';
import RecordResult from '../../dashboard/EnterQueue/RecordYourResult';
import AchievementScreen from '../../dashboard/EnterQueue/AchievmentScreen';
import TeeBoxScreen from '../../dashboard/EnterQueue/TeeScreen';
import CountdownBox from '../../dashboard/EnterQueue/CountdownBox';
import TeeBoxResults from '../../dashboard/EnterQueue/TeeBoxResult';
import HitTheGreen from '../../dashboard/EnterQueue/HitTheGreen';
import CourseScreen from '../../dashboard/betCentral/CourseScreen';
import VedioHighlights from '../../dashboard/HighlightHub/VedioHighlights';
import LeaderBoard from '../../dashboard/LeaderBoard/LeaderBoard';
import AllLeaderBoardVedio from '../../dashboard/LeaderBoard/AllLeaderBoardVedio';
import PlayerLeaderboard from '../../dashboard/LeaderBoard/PlayerLeaderboard';
import Home from '../../dashboard/qr';
import MainDashboard from '../../dashboard/Main/dashboard';
import JeevaniScreen from '../../dashboard/jeevani';
import SongsPage from '../../dashboard/songs';
import NotificationScreen from '../../dashboard/notification';
import VideoScreen from '../../dashboard/video';
import PostScreen from '../../dashboard/posts';
import VideoPlayer from '../../../components/VideoPlayer';

// --------------------------------
// Stack Navigators
// --------------------------------
const HomeStack = createStackNavigator();

const BetCentralStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="CourseScreen" component={CourseScreen} />
    <HomeStack.Screen name="CourceDetails" component={CourceDetails} />
    <HomeStack.Screen name="CourceCart" component={CourceCart} />
    <HomeStack.Screen name="PayingCart" component={PayingCart} />
  </HomeStack.Navigator>
);

const LeaderBoardStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
    <HomeStack.Screen
      name="AllLeaderBoardVedio"
      component={AllLeaderBoardVedio}
    />
    <HomeStack.Screen name="PlayerLeaderboard" component={PlayerLeaderboard} />
  </HomeStack.Navigator>
);

const ProfileStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Community" component={Community} />
    <HomeStack.Screen name="EditProfile" component={ProfilePage} />
    <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
    <HomeStack.Screen
      name="AllLeaderBoardVedio"
      component={AllLeaderBoardVedio}
    />
  </HomeStack.Navigator>
);

const QueStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="EnterQue" component={EnterQueueHome} />
    <HomeStack.Screen name="RecordResults" component={RecordResult} />
    <HomeStack.Screen name="AchievementScreen" component={AchievementScreen} />
    <HomeStack.Screen name="TeeBoxScreen" component={TeeBoxScreen} />
    <HomeStack.Screen name="CountdownBox" component={CountdownBox} />
    <HomeStack.Screen name="TeeBoxResults" component={TeeBoxResults} />
    <HomeStack.Screen name="HitTheGreen" component={HitTheGreen} />
    <HomeStack.Screen name="VedioHighlights" component={VedioHighlights} />
  </HomeStack.Navigator>
);

const HomeStackScreens = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      options={{headerShown: false}}
      name="MainDashboard"
      component={MainDashboard}
    />
    <HomeStack.Screen
      name="SongScreen"
      options={{
        headerTitle: 'Songs',
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 18},
      }}
      component={SongsPage}
    />
    <HomeStack.Screen
      name="VideoScreen"
      options={{
        headerTitle: 'Videos',
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 18},
      }}
      component={VideoScreen}
    />
    <HomeStack.Screen
      name="Profiles"
      options={{headerShown: false}}
      component={ProfilePage}
    />
    <HomeStack.Screen name="Posts" component={PostScreen} />
    <HomeStack.Screen
      name="VideoPlayer"
      options={{
        headerTitleAlign: 'center',
        headerTitle: 'Video Player',
        headerTitleStyle: {fontSize: 18},
      }}
      component={VideoPlayer}
    />
  </HomeStack.Navigator>
);

// --------------------------------
// Custom Components
// --------------------------------
const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -24,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}>
    <View style={{width: 65, height: 65, borderRadius: 57.5}}>{children}</View>
  </TouchableOpacity>
);

const renderTabIcon =
  (IconComponent, name) =>
  ({focused}) =>
    (
      <View style={st.icon}>
        <IconComponent
          name={name}
          size={28}
          color={focused ? colors.orange : colors.ICON_GREY}
        />
      </View>
    );

const renderTabImage =
  (image, name) =>
  ({focused}) =>
    (
      <View style={st.icon}>
        <Image
          source={image}
          style={{
            width: 28,
            height: 28,
            tintColor: focused ? colors.orange : colors.ICON_GREY,
            alignSelf: 'center',
            opacity: focused ? 1 : 0.5,
          }}
        />
      </View>
    );

// --------------------------------
// Bottom Navigation
// --------------------------------
const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: true,
        tabBarActiveTintColor: colors.PRIMARY_BUTTON,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: '#fff',
          borderRadius: 15,
          height: 64,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: {width: 0, height: 5},
          shadowRadius: 10,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreens}
        options={{
          tabBarIcon: renderTabImage(images.home, 'home'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Jevaani"
        component={Home}
        options={{
          tabBarIcon: renderTabIcon(MaterialCommunityIcons, 'hand-front-right'),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{paddingLeft: 15}}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#000"
              />
            </Pressable>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 18},
        }}
      />

      <Tab.Screen
        name="Scan"
        component={Home}
        options={{
          tabBarIcon: () => (
            <View style={styles.createBtn}>
              <AntDesign name="plus" color="#fff" size={24} />
            </View>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Info"
        component={JeevaniScreen}
        options={{
          tabBarIcon: renderTabImage(images.location, 'location'),
        }}
      />

      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: renderTabImage(images.notification, 'notification'),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{paddingLeft: 15}}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#000"
              />
            </Pressable>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 18},
        }}
      />
    </Tab.Navigator>
  );
}

// --------------------------------
// Styles
// --------------------------------
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7cc242',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  createBtn: {
    width: 64,
    height: 64,
    alignSelf: 'center',
    marginTop: 6,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 55,
  },
});
