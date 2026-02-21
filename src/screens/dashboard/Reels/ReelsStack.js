import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReelsScreen from './ReelsScreen';
import PostReelScreen from './PostReelScreen';

const Stack = createStackNavigator();

const ReelsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReelsFeed" component={ReelsScreen} />
    <Stack.Screen name="PostReel" component={PostReelScreen} />
  </Stack.Navigator>
);

export default ReelsStack;
