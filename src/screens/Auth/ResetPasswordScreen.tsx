import { Pressable, StyleSheet, Text, View, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, customStyles } from '../../assets/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from './Auth';
import GradientBackground from './components/GradientBackground';
import AuthHeader from './components/AuthHeader';
import AuthButton from './components/AuthButton';


type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const ResetPasswordScreen = () => {
    const navigation = useNavigation<AuthNavigationProp>();


    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
            <GradientBackground>
                <View style={styles.bg}>
                    {/* Heading */}
                    <AuthHeader title='Reset Password' subtitle='  Don’t Worry, you can use the two methods Below to get your account back.' />

                    <View style={styles.formContainer}>
                        {/* Inputs */}
                        <Pressable style={styles.optionCard}>
                            <View style={styles.cardImage} />
                            <View style={styles.cardtxtContainer}>
                                <Text style={[styles.lightText, customStyles.fontMedium]}>Via Email</Text>
                                <Text style={[styles.lightText, customStyles.fontLight]}>**********1415</Text>
                            </View>
                            <View style={customStyles.padding10}>
                                <Icon name="circle-thin" size={18} />
                            </View>
                        </Pressable>
                        <View>
                            <Text style={styles.separatorTxt}>Or</Text>
                        </View>
                        <Pressable style={styles.optionCard}>
                            <View style={styles.cardImage} />
                            <View style={styles.cardtxtContainer}>
                                <Text style={[styles.lightText, customStyles.fontMedium]}>Via Email</Text>
                                <Text style={[styles.lightText, customStyles.fontLight]}>**********1415</Text>
                            </View>
                            <View style={customStyles.padding10}>
                                <Icon name="circle-thin" size={18} />
                            </View>
                        </Pressable>
                    </View>
                        {/* Login Button */}
                    <View style={styles.btnContainer}>
                        <AuthButton label='Continue' icon='send' onPress={() => { navigation.navigate("VerifyPassword") }} />
                    </View>
                </View>

            </GradientBackground>
        </SafeAreaView >
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        backgroundColor: colors.background,
        borderTopLeftRadius: 50,
        paddingHorizontal: 36,
        height: '85%',
    },
    headingContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    subText: {
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        paddingHorizontal: 10,
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
    header: {
        textAlign: 'center',
        fontSize: 24,
        color: colors.title,
        fontFamily: 'Rubik-Bold',
        paddingBottom: 4,

    },

    btnContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
        alignSelf: "center",
        bottom: 20,
    },
    lightText: {
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        opacity: 0.8,
    },

    optionCard: {
        marginTop: 6,
        backgroundColor: colors.background,
        padding: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.secondary,
        flexDirection: 'row',
        gap: 10,
        height: 65,
        alignItems: 'center',
    },
    cardImage: {
        width: 50,
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 10
    },
    separatorTxt: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.text,
        fontFamily: 'Rubik-Bold',
        textTransform: 'uppercase',
    },
    cardtxtContainer: {
        flex: 1,
        justifyContent: "center"
    }
});
