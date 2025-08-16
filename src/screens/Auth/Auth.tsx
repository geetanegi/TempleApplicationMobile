import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};
const AuthStack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen}
             options={{
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }}  />
            <AuthStack.Screen name="Signup" component={CreateAccountScreen}
                options={{
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }} />
        </AuthStack.Navigator>
    );
}
