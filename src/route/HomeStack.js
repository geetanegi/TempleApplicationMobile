import 'react-native-gesture-handler';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSidebarMenu from './CustomSidebarMenu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Main from '../screens/dashboard/home/Main';
import Home from '../screens/dashboard/home/Main';
import {colors} from '../global/theme';
import EditProfile from '../screens/dashboard/editProfile';

import {useSelector} from 'react-redux';
import ChangePassword from '../screens/dashboard/changePassword';
import otp from '../screens/Auth/otp';
import {ENUM} from '../utils/enum/data';
import SessionCheck from './SessionCheck';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VideoPlayerComp from '../screens/dashboard/videoPlayer';
import BottomNavigator from '../screens/BottomNavigation/navigation';
import Community from '../screens/dashboard/community/CommunityList';
import EditProfileScreen from '../screens/dashboard/Profile/EditProfileScreen';
import ProfileScreen from '../screens/dashboard/Profile/Profilepage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const HomeStack = () => {
  const tour_data = useSelector(state => state.tour?.data);

  return (
    <>
      {/* <SessionCheck /> */}
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={tour_data ? Main : Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="otp"
          component={otp}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="Community"
          component={Community}
          options={{headerShown: false}}
        /> */}
      </Stack.Navigator>
    </>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Profile'}>
      <Stack.Screen
        name="Profile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const VideoPlayerStack = () => {
  return (
    <Stack.Navigator initialRouteName={'VideoPlayer'}>
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerComp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.blue,
        drawerInactiveTintColor: '#333',
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={BottomNavigator}
        options={{
          headerShown: false,
          drawerItemStyle: {height: 0},
        }}
      />
      {/* // drawerContent={props => <CustomSidebarMenu {...props} />}> */}
      {/* <Drawer.Screen
        name="Dashboard"
        options={{
          drawerLabel: 'Home',
          headerShown: false,
          drawerIcon: ({color}) => (
            <LinearGradient
              colors={[colors.indian_red, '#7776B6']}
              style={styles.circle}>
              <Icon name="home" size={22} color={'#fff'} />
            </LinearGradient>
          ),
        }}
        component={HomeStack}
      /> */}

      <Drawer.Screen
        name="EditProfile"
        options={{
          drawerLabel: 'Profile',
          headerShown: false,
          drawerIcon: ({color}) => (
            <LinearGradient
              colors={[colors.indian_red, '#7776B6']}
              style={styles.circle}>
              <Icon name="account-outline" size={22} color={'#fff'} />
            </LinearGradient>
          ),
        }}
        component={EditProfileScreen}
      />
         <Drawer.Screen
        name="Profile"
        options={{
          drawerLabel: 'Profile',
          headerShown: false,
          drawerIcon: ({color}) => (
            <LinearGradient
              colors={[colors.indian_red, '#7776B6']}
              style={styles.circle}>
              <Icon name="account-outline" size={22} color={'#fff'} />
            </LinearGradient>
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="VideoPlayers"
        options={{
          drawerLabel: 'Video Player',
          headerShown: false,
          drawerIcon: ({color}) => (
            <LinearGradient
              colors={[colors.indian_red, '#7776B6']}
              style={styles.circle}>
              <Icon name="account-outline" size={22} color={'#fff'} />
            </LinearGradient>
          ),
        }}
        component={VideoPlayerStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;

const styles = StyleSheet.create({
  circle: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
