import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import VerifyPassScreen from './VerifyPassScreen';
import CreatePassScreen from './CreatePasswordScreen';

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    ResetPassword: undefined;
    VerifyPassword: undefined;
    CreatePassword: undefined;
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
                }} />
            <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <AuthStack.Screen name="VerifyPassword" component={VerifyPassScreen} />
            <AuthStack.Screen name="CreatePassword" component={CreatePassScreen} />
            <AuthStack.Screen name="Signup" component={CreateAccountScreen}
                options={{
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }} />
        </AuthStack.Navigator>
    );
}
