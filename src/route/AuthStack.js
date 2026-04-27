import 'react-native-gesture-handler';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/login';
import Signup from '../screens/Auth/signup';
import Otp from '../screens/Auth/otp';
import Verifyemail from '../screens/Auth/Verifyemail';
import ChangePassword from '../screens/dashboard/changePassword';
import LegalDocumentScreen from '../screens/legal/LegalDocumentScreen';
// import SuccessScreen from '../screens/Auth/success';
const Stack = createNativeStackNavigator();
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
      <Stack.Screen
        name="PrivacyPolicy"
        component={LegalDocumentScreen}
        initialParams={{document: 'privacy'}}
      />
      <Stack.Screen
        name="TermsOfService"
        component={LegalDocumentScreen}
        initialParams={{document: 'terms'}}
      />
      {/* <Stack.Screen name="SuccessScreen" component={SuccessScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
