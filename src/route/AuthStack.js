import 'react-native-gesture-handler';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/login';
import Signup from '../screens/Auth/signup';
import {onApplicationOpen} from '../utils/helperfunctions/tiggerfunction'
import Otp from '../screens/Auth/otp';
import Verifyemail from '../screens/Auth/Verifyemail';
import ChangePassword from '../screens/dashboard/changePassword';
import SuccessScreen from '../screens/Auth/success';
const Stack = createNativeStackNavigator();
onApplicationOpen()
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Login'}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="otp" component={Otp} />
      <Stack.Screen name="Verifyemail" component={Verifyemail} />
      <Stack.Screen name="Changepassword" component={ChangePassword}/>
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      
    </Stack.Navigator>
  );
};

export default AuthStack;
