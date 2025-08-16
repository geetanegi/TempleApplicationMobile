import { Pressable, StyleSheet, Text, View, TextInput, Image, ImageBackground, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from './Auth';
import { runOnJS } from 'react-native-reanimated';

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
        <SafeAreaView style={styles.container}>
            <LinearGradient
                style={styles.container}
                colors={[colors.linearGradient[0], colors.linearGradient[1]]} // Using the colors from the theme
                start={{ x: 0, y: 0 }} // Top-left
                end={{ x: 1, y: 1 }} // Bottom-right (creates a diagonal gradient)
            >
                {/* Logo */}
                <Image style={styles.imageLogo} source={require('../../images/logoSample.png')} />
                <View style={styles.bg}>
                    {/* Heading */}
                    <View >
                        <Text style={styles.header}>Log In to your Account</Text>
                    </View>

                    <View style={{ gap: 16 }}>

                        {/* Inputs */}
                        <View>
                            <Text style={[styles.lightText, { fontSize: 12, textTransform: "uppercase" }]}>Email or Username</Text>
                            <TextInput
                                style={styles.inputBox}
                                keyboardType="email-address"
                            />
                        </View>
                        <View>
                            <Text style={[styles.lightText, { fontSize: 12, textTransform: "uppercase" }]}>Password</Text>
                            <TextInput
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                            />
                        </View>
                        <View style={styles.recoverAcc}>
                            <Pressable style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Text style={styles.lightText}>Recover Password?</Text>
                            </Pressable>
                        </View>
                        {/* Login Button */}
                        <Pressable style={styles.loginButton}>
                            <Text style={styles.loginText}>Proceed</Text>
                            <Icon name='send' size={18} color={colors.background} />
                        </Pressable>

                    </View>
                    {/* Sign Up Link */}

                </View>
                <GestureDetector gesture={panGesture}>
                    <View collapsable={false} style={styles.alreadyAcc}>

                        <ImageBackground resizeMode="contain" source={require('../../images/objects.png')}
                            style={styles.alreadyAcc}>
                            <Icon name='chevron-circle-up' size={26} color={colors.background} />

                            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.accountCreate}>New User? </Text>
                                <Text style={styles.linkText}>Swipe Up</Text>
                            </Pressable>
                        </ImageBackground>
                    </View>
                </GestureDetector>
            </LinearGradient>
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
    imageLogo: {
        width: 152,
        alignSelf: 'center',
        margin: "auto"
    },
    header: {
        textAlign: 'center',
        fontSize: 24,
        paddingVertical: 28,
        color: colors.title,
        fontFamily: 'Rubik-Bold',
    },
    brandName: {
        textAlign: 'center',
        fontSize: 28,
        color: 'purple',
        fontWeight: 'bold',
        fontFamily: 'Rubik-Bold'

    },
    inputBox: {
        height: 70,
        width: '100%',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: colors.secondary,
        fontSize: 15,
        color: colors.text,

    },
    loginButton: {
        backgroundColor: colors.secondary,
        paddingVertical: 20,
        width: '100%',
        alignItems: 'center',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    loginText: {
        color: '#fff',
        fontSize: 17,
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        width: '100%',
    },
    recoverAcc: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountCreate: {
        fontSize: 16,
        color: 'white',

    },
    linkText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Rubik-Medium',
    },
    lightText: {
        fontSize: 14,
        fontFamily: 'Rubik',
        opacity: 0.8,

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
});
