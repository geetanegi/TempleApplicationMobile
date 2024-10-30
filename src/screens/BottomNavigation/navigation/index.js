import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {APP_TEXT, colors, images} from '../../../global/theme';
import Home from '../../dashboard/qr';
import {
  House,
  TvMinimalPlay,
  ScanLine,
  Users,
  User,
  ScanQrCode,
  CircleDollarSign,
  Plus,
  Heart
} from 'lucide-react-native';
import st from '../../../global/styles';
import {useDispatch} from 'react-redux';
import ApplicationButton from '../../../components/ApplicationButton';
import {clearLogin} from '../../../redux/reducers/Login';
import Community from '../../dashboard/community/CommunityList';

import HomeScreen from '../../dashboard/betCentral/HomeScreen';
import CourceDetails from '../../dashboard/betCentral/CourceDetails';
import CourceCart from '../../dashboard/betCentral/CourceCart';
import PayingCart from '../../dashboard/betCentral/PayingCart';

import HomeDashBoard from '../../dashboard/HomeScreen/HomeDashBoard'

import ProfileCard from '../../dashboard/Profile/Profilepage';
import {createStackNavigator} from '@react-navigation/stack';
import VideoPlayer from '../../dashboard/videoManagement';
import VideoPlayerComp from '../../dashboard/videoPlayer';
import { cleanLogindata } from '../../../redux/reducers/Logindata';
import StartScreen from '../../dashboard/queueEntry.js/startScreen';
import SongPlayer from '../../dashboard/songPlayer';
import AwarenessVdo from '../../dashboard/Video/videoList';
import ViewVdo from '../../dashboard/Video/ViewVdo';
import IEC from '../../dashboard/PDF';
import ViewPdf from '../../dashboard/PDF/ViewPdf';


const BetCentral = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="CourceDetails" component={CourceDetails} />
      <HomeStack.Screen name="CourceCart" component={CourceCart} />
      <HomeStack.Screen name="PayingCart" component={PayingCart} />
    </HomeStack.Navigator>
  );
};


const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeDashBoard"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeDashBoard" component={Home} />
       {/* <HomeStack.Screen name="SongPlayer" component={SongPlayer} />
       <HomeStack.Screen name="AwarenessVdo" component={AwarenessVdo} /> */}
       {/* <HomeStack.Screen name="IEC" component={IEC} /> */}
       {/* <HomeStack.Screen
        name="ViewVdo"
        component={ViewVdo}
      /> */}
      
      {/* <HomeStack.Screen
        name="ViewPdf"
        component={ViewPdf}
      /> */}
    </HomeStack.Navigator>
  );
};

function Home1() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
    </View>
  );
}

function ContestsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Bet Central Screen</Text>
    </View>
  );
}

function CommunityScreen() {
  return (
    <View style={styles.screen}>
      <Text>Community Screen</Text>
    </View>
  );
}
function ScanScanner() {
  const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <Text>Scaneer Screen</Text>
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

const HomeStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const ProfileStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Community"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Community" component={Community} />
      <HomeStack.Screen name="EditProfile" component={ProfileCard} />
    </HomeStack.Navigator>
  );
};



const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -30, // Elevated button
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}>
    <View
      style={{
        width: 75,
        height: 75,

        borderWidth: 5, // Define border width
        borderColor: '#FFF',

        borderRadius: 37.5,
        backgroundColor: '#FFF',
      }}>
      {children}
    </View>
    <Text
      style={{
        color: colors.black,
        fontSize: 12,
        marginTop: 9,
      }}>
      {APP_TEXT.HOME}
    </Text>
  </TouchableOpacity>
);


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
          // shadowColor: 'red',
          height: 80,
          // backgroundColor: colors.BACKGROUD_ICON_COLOR,
        },
        activeTintColor: 'black',
        tabBarLabelStyle: {marginBottom: 20},
      }}>
      {/* <Tab.Screen
        name="Home"
        //  component={Home1}
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <House
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
                {APP_TEXT.HOME}
              </Text>
            </View>
          ),
        }}
      /> */}
      <Tab.Screen
        name="Community"
        component={ProfileStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <Users
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
                {APP_TEXT.COMMUNITIES}
              </Text>
            </View>
          ),
        }}
      />
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
        component={ScanScanner}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
            source={images.logoBuddha}
            style={{
              width: 50,
              height: 50,
              alignSelf: 'center',
              marginTop: -10,
            }}
          />
            // <Plus
            //   strokeWidth={1}
            //   style={{
            //     color: colors.white,
            //     padding: 10,
            //   }}
            //   size={32}
            // />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="BetCentral"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <Hand
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
                {APP_TEXT.NOTI}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profiles"
        component={ProfileCard}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <User
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
                {APP_TEXT.PROFILE}
              </Text>
            </View>
          ),
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
});
