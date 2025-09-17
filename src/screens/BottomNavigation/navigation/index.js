import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {APP_TEXT, colors, images} from '../../../global/theme';
import st from '../../../global/styles';
import Community from '../../dashboard/community/CommunityList';
import CourceDetails from '../../dashboard/betCentral/HoleScreen';
import CourceCart from '../../dashboard/betCentral/TeeScreen';
import PayingCart from '../../dashboard/betCentral/CheckoutCart';
import ProfileCard from '../../dashboard/Profile/Profilepage';
import {createStackNavigator} from '@react-navigation/stack';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TvMinimalPlay from 'react-native-vector-icons/MaterialCommunityIcons';
import Plus from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import JeevaniScreen from '../../dashboard/jeevani';
import SongsPage from '../../dashboard/songs';
import NotificationScreen from '../../dashboard/notification';
import VideoScreen from '../../dashboard/video';
import PostScreen from '../../dashboard/posts';
import VideoPlayer from '../../../components/VideoPlayer';

const BetCentral = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="CourseScreen"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="CourseScreen" component={CourseScreen} />
      <HomeStack.Screen name="CourceDetails" component={CourceDetails} />
      <HomeStack.Screen name="CourceCart" component={CourceCart} />
      <HomeStack.Screen name="PayingCart" component={PayingCart} />
    </HomeStack.Navigator>
  );
};

const leaderBoardStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="LeaderBoard"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
      <HomeStack.Screen
        name="AllLeaderBoardVedio"
        component={AllLeaderBoardVedio}
      />
      <HomeStack.Screen
        name="PlayerLeaderboard"
        component={PlayerLeaderboard}
      />
    </HomeStack.Navigator>
  );
};

// const Home = () => {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeDashboard"
//       screenOptions={{headerShown: false}}>
//       <HomeStack.Screen name="HomeDashboard" component={Dashboard} />
//     </HomeStack.Navigator>
//   );
// };

const HomeStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const ProfileStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Community"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Community" component={Community} />
      <HomeStack.Screen name="EditProfile" component={ProfileCard} />
      <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
      <HomeStack.Screen
        name="AllLeaderBoardVedio"
        component={AllLeaderBoardVedio}
      />
    </HomeStack.Navigator>
  );
};

const QueStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="EnterQue"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="EnterQue" component={EnterQueueHome} />
      <HomeStack.Screen name="RecordResults" component={RecordResult} />
      <HomeStack.Screen
        name="AchievementScreen"
        component={AchievementScreen}
      />
      <HomeStack.Screen name="TeeBoxScreen" component={TeeBoxScreen} />
      <HomeStack.Screen name="CountdownBox" component={CountdownBox} />
      <HomeStack.Screen name="TeeBoxResults" component={TeeBoxResults} />
      <HomeStack.Screen name="HitTheGreen" component={HitTheGreen} />
      <HomeStack.Screen name="VedioHighlights" component={VedioHighlights} />
    </HomeStack.Navigator>
  );
};

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -24, // Elevated button
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}>
    <View
      style={{
        width: 65,
        height: 65,
        borderRadius: 57.5,
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

function ScanScanner() {
  // const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <Text>Home Screen 1</Text>
      {/* <VideoPlayer/> */}

      {/* <ApplicationButton
        backgroundColor={colors.PRIMARY_BUTTON}
        label={'Logout'}
        onButtonPress={() => {
          dispatch(clearLogin());
          dispatch(cleanLogindata());
        }}
      /> */}
    </View>
  );
}

function HomeScanner() {
  // const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <Text>Profile Screen</Text>
      {/* <VideoPlayer/> */}

      {/* <ApplicationButton
        backgroundColor={colors.PRIMARY_BUTTON}
        label={'Logout'}
        onButtonPress={() => {
          dispatch(clearLogin());
          dispatch(cleanLogindata());
        }}
      /> */}
    </View>
  );
}

// Resuable Component to render tab icon
const renderTabIcon =
  (IconComponent, name) =>
  ({focused}) =>
    (
      <View style={[st.icon]}>
        <IconComponent
          name={name}
          strokeWidth={1}
          style={{
            color: focused ? colors.orange : colors.ICON_GREY,
          }}
          size={28}
        />
      </View>
    );
const renderTabImage =
  (image, name) =>
  ({focused}) =>
    (
      <View style={[st.icon]}>
        <Image
          source={image}
          alt={name}
          style={{
            width: 28,
            tintColor: focused ? colors.orange : colors.ICON_GREY,
            height: 28,
            alignSelf: 'center',
            opacity: focused ? 1 : 0.5,
          }}
        />
      </View>
    );

// Category Stack Screens
function HomeStackScreens() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="MainDashboard" component={MainDashboard} />
      <HomeStack.Screen name="SongScreen" component={SongsPage} />
      <HomeStack.Screen name="VideoScreen" component={VideoScreen} />
      <HomeStack.Screen name="Profiles" component={ProfileCard} />
      <HomeStack.Screen name="Posts" component={PostScreen} />
      <HomeStack.Screen name="VideoPlayer" component={VideoPlayer} />
    </HomeStack.Navigator>
  );
}

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        initialRouteName: 'Home',
        headerShown: false,
        tabBarActiveTintColor: colors.PRIMARY_BUTTON,
        showLabel: false,
        style: {
          height: 20,
          elevation: 0,
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          top: 30,
          borderRadius: 15,
        },

        tabBarLabelPosition: {
          marginBottom: 10,
        },
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
        activeTintColor: 'black',
        tabBarLabelStyle: {marginBottom: 20},
      }}>
      <Tab.Screen
        name="Home"
        // component={VedioHighlights}
        // component={Home}
        // component={QueStack}
        // component={LeaderBoard}
        component={HomeStackScreens}
        options={{
          tabBarIcon: renderTabImage(images.home, 'home'),
        }}
      />
      <Tab.Screen
        name="Jevaani"
        component={JeevaniScreen}
        options={{
          tabBarIcon: renderTabIcon(MaterialCommunityIcons, 'hand-front-right'),
        }}
      />
      {/* <Tab.Screen
        name="Community"
        component={ProfileStack}
        options={{
          tabBarIcon: renderTabIcon(FontAwesome, 'user'),
        }}
      /> */}
      {/* <Tab.Screen
        name="Contests"
        component={ContestsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <TvMinimalPlay
                strokeWidth={1}
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                }}
                size={32}
              />
              <Text
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                  fontSize: 10,
                }}>
                {APP_TEXT.CONTESTS}
              </Text>
            </View>
          ),
        }}
      /> */}
      <Tab.Screen
        name="Scan"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.createBtn}>
              <AntDesign name="plus" color="#fff" size={24} />
            </View>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Info"
        component={ProfileCard}
        options={{
          tabBarIcon: renderTabImage(images.location, 'location'),
        }}
      />

      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: renderTabImage(images.notification, 'notification'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#7cc242',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    // elevation: 1,
  },
  tabBarStyle: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 90,
    // ...styles.shadow,
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
