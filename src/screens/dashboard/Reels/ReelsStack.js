import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReelsScreen from './ReelsScreen';
import PostReelScreen from './PostReelScreen';
import ProfileScreen from '../Profile/Profilepage';
import FollowListScreen from '../Profile/FollowListScreen';

const Stack = createStackNavigator();

const ReelsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReelsFeed" component={ReelsScreen} />
    <Stack.Screen name="PostReel" component={PostReelScreen} />
    <Stack.Screen name="Profiles" component={ProfileScreen} />
    <Stack.Screen name="FollowList" component={FollowListScreen} />
  </Stack.Navigator>
);

export default ReelsStack;
