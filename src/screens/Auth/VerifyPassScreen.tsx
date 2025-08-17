import { StyleSheet, Text, TextInput, View, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, customStyles } from '../../assets/theme';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from './Auth';
import AuthHeader from './components/AuthHeader';
import AuthButton from './components/AuthButton';
import GradientBackground from './components/GradientBackground';
// import { useRef, useState } from 'react';


type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const VerifyPassScreen = () => {
    const navigation = useNavigation<AuthNavigationProp>();

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
            <GradientBackground>
                {/* Logo */}
                {/* <Image style={styles.imageLogo} source={require('../../images/logoSample.png')} /> */}
                <View style={styles.bg}>
                    {/* Heading */}
                    <AuthHeader title='Enter Verification Code' subtitle=' We have sent 4 digit verification code to your number.' />

                    <View style={styles.formContainer}>
                        <View style={styles.otpContainer}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                                numberOfLines={1}
                                maxLength={1}
                            />
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                                numberOfLines={1}
                                maxLength={1}
                            /> <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                                numberOfLines={1}
                                maxLength={1}
                            />
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                                numberOfLines={1}
                                maxLength={1}
                            />
                        </View>
                        <View>
                            <Text style={styles.subText}>
                                Do not receive code? <Text style={customStyles.fontMedium}>Request again</Text>
                            </Text>
                        </View>

                        {/* Login Button */}

                    </View>
                    <View style={styles.btnContainer}>
                        <AuthButton label='Verify' onPress={() => navigation.navigate('CreatePassword')} />
                    </View>

                </View>

            </GradientBackground>
        </SafeAreaView >
    );
};

export default VerifyPassScreen;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        backgroundColor: colors.background,
        borderTopLeftRadius: 50,
        paddingHorizontal: 36,
        height: '85%',
    },
    subText: {
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    inputBox: {
        height: 70,
        width: 70,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.secondary,
        fontSize: 24,
        color: colors.text,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
    },
    formContainer: {
        gap: 16,
    },
    inputLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        fontFamily: 'Rubik',
        opacity: 0.8,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        position: 'relative',

    },
    imageLogo: {
        width: 152,
        alignSelf: 'center',
        margin: "auto"
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    btnContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
        alignSelf: "center",
        bottom: 20,
    },

});
