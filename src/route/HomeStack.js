import 'react-native-gesture-handler';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {StyleSheet} from 'react-native';
import Main from '../screens/dashboard/home/Main';
import Home from '../screens/dashboard/home/Main';
import {colors} from '../global/theme';
import EditProfile from '../screens/dashboard/editProfile';
import {useSelector} from 'react-redux';
import ChangePassword from '../screens/dashboard/changePassword';
import otp from '../screens/Auth/otp';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import BottomNavigator from '../screens/BottomNavigation/navigation';
import DrawerScreen from '../screens/dashboard/Profile/DrawerScreen';
import PlaceholderScreen from '../screens/dashboard/Profile/PlaceholderScreen';
import LegalDocumentScreen from '../screens/legal/LegalDocumentScreen';
import FeedbackScreen from '../screens/dashboard/Feedback/FeedbackScreen';

import VideosReelsScreen from '../screens/dashboard/VideosReels/VideosReelsScreen';
import {Dimensions} from 'react-native';
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

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.blue,
        drawerInactiveTintColor: '#333',
        drawerStyle: {
          width: Dimensions.get('window').width / 1.25,
        },
      }}
      drawerContent={props => <DrawerScreen {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={BottomNavigator}
        options={{
          headerShown: false,
          drawerItemStyle: {height: 0},
        }}
      />

      <Drawer.Screen
        name="AccountScreen"
        component={PlaceholderScreen}
        initialParams={{ title: 'Account' }}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="SupportScreen"
        component={PlaceholderScreen}
        initialParams={{ title: 'Support' }}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="PrivacyPolicyScreen"
        component={LegalDocumentScreen}
        initialParams={{ document: 'privacy' }}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="TermsAndConditionScreen"
        component={LegalDocumentScreen}
        initialParams={{ document: 'terms' }}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="ConfigurationScreen"
        component={PlaceholderScreen}
        initialParams={{ title: 'Configuration' }}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="YouTubeVideosScreen"
        component={VideosReelsScreen}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
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
