import { Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import type { StackNavigationProp } from '@react-navigation/stack';
// import type { AuthStackParamList } from './Auth';


// type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const CreatePassScreen = () => {
    // const navigation = useNavigation<AuthNavigationProp>();


    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                style={styles.container}
                colors={[colors.linearGradient[0], colors.linearGradient[1]]} // Using the colors from the theme
                start={{ x: 0, y: 0 }} // Top-left
                end={{ x: 1, y: 1 }} // Bottom-right (creates a diagonal gradient)
            >
                {/* Logo */}
                {/* <Image style={styles.imageLogo} source={require('../../images/logoSample.png')} /> */}
                <View style={styles.bg}>
                    {/* Heading */}
                    <View style={styles.headingContainer}>
                        <Text style={styles.header}>Create New Password</Text>
                        <Text style={styles.subText}>
                            Your new password must be different from
                            previous used password.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View>
                            <Text style={[styles.lightText, { fontSize: 12, }]}>New Password</Text>
                            <TextInput
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                                placeholder='**********'
                            />
                            <Icon name="eye-slash" size={16} style={{ position: 'absolute', right: 15, top: 45 }} />
                        </View>
                        <View>
                            <Text style={[styles.lightText, { fontSize: 12, }]}>Confirm Password</Text>
                            <TextInput
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.inputBox}
                                placeholder='**********'

                            />
                            <Icon name="eye-slash" size={16} style={{ position: 'absolute', right: 15, top: 45 }} />

                        </View>


                        {/* Login Button */}

                    </View>
                    <Pressable style={styles.Button} >
                        <Text style={styles.btnText}>Verify</Text>
                    </Pressable>
                </View>

            </LinearGradient>
        </SafeAreaView >
    );
};

export default CreatePassScreen;

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
    inputBox: {
        height: 70,
        width: '100%',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: colors.secondary,
        fontSize: 15,
        color: colors.text,
        fontFamily: 'Rubik-Regular',
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

    Button: {
        backgroundColor: colors.secondary,
        paddingVertical: 20,
        width: '100%',
        alignItems: 'center',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 50,
        marginHorizontal: "auto",
        marginBottom: 20,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        padding: 15,
    },
    btnText: {
        color: '#fff',
        fontSize: 17,
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        width: '100%',
    },

    linkText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Rubik-Medium',
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
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }
});
