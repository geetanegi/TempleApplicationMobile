import { Pressable, StyleSheet, Text, View, Image, ImageBackground, StatusBar, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/theme';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from './Auth';
import { runOnJS } from 'react-native-reanimated';
import AuthHeader from './components/AuthHeader';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';
import GradientBackground from './components/GradientBackground';
import SwipeUpFooter from './components/SwipeUpFooter';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const handleSwipeUp = () => {
        navigation.navigate('Signup');
    };
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY < -50) {
                runOnJS(handleSwipeUp)();
            }
        });
    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>            <StatusBar
            backgroundColor="#b92222ff" // Android
            barStyle="dark-content"       // Android + iOS (dark icons)
            translucent={false}
            hidden
        />
            <GradientBackground>
                {/* Logo */}
                <View style={styles.imageContainer}>
                    <Image style={styles.imageLogo} source={require('../../images/logoSample.png')} />
                </View>
                <View style={styles.bg}>
                    {/* Heading */}
                    <AuthHeader title='Log In to your Account' />

                    <View>
                        {/* Inputs */}
                        <AuthInput label='Email or Username' />
                        <AuthInput label='Password' secure={true} />

                        <View style={styles.recoverAcc}>
                            <Pressable onPress={() => navigation.navigate("ResetPassword")} style={styles.linkBtn}>
                                <Text style={styles.lightText}>Recover Password?</Text>
                            </Pressable>
                        </View>
                        {/* Login Button */}
                        <AuthButton label='Proceed' icon='send' onPress={() => { }} />
                    </View>
                    {/* Sign Up Link */}

                </View>
                <GestureDetector gesture={panGesture}>
                    <View collapsable={false} style={styles.alreadyAcc}>

                        <ImageBackground resizeMode="contain" source={require('../../images/objects.png')}
                            style={styles.alreadyAcc}>
                            <SwipeUpFooter text='New user?' link='Swipe Up' />
                        </ImageBackground>
                    </View>
                </GestureDetector>
            </GradientBackground>
        </SafeAreaView >
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        backgroundColor: colors.background,
        borderTopLeftRadius: 50,
        paddingHorizontal: 36,
        height: '80%',

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'relative',

    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    imageLogo: {
        width: 152,
        alignSelf: 'center',
    },
    recoverAcc: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lightText: {
        fontSize: 14,
        opacity: 0.8,
        fontFamily: 'Rubik-Regular',
    },
    alreadyAcc: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        position: 'absolute',
        bottom: 0,
        backgroundColor: colors.primary,
        width: '100%',
        height: 110,
        borderTopRightRadius: 50,
        paddingHorizontal: 36,
    },
    linkBtn: {
        flex: 1,
        alignItems: 'flex-end'
    }
});
