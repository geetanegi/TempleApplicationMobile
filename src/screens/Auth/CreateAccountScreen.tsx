import { StyleSheet, View, Image, ImageBackground, } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets/theme';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from './Auth';
import { runOnJS } from 'react-native-reanimated';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import AuthHeader from './components/AuthHeader';
import SwipeUpFooter from './components/SwipeUpFooter';
import GradientBackground from './components/GradientBackground';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const CreateAccountScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const handleSwipeUp = () => {
    navigation.navigate('Login');
  };
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < -50) {
        runOnJS(handleSwipeUp)();
      }
    });
  return (
    <SafeAreaView edges={["bottom", "right", "left"]} style={styles.container}>
      <GradientBackground>
        {/* Logo */}
        <View style={styles.imageContainer}>
          <Image style={styles.imageLogo} source={require('../../images/logoSample.png')} />
        </View>
        <View style={styles.bg}>
          {/* Heading */}
          <AuthHeader title='Create your Account' />

          <View>
            {/* Inputs */}
            <AuthInput label='Full name' />
            <AuthInput label='Email' />
            <AuthInput label='Date of Birth' />
            <AuthInput label='Contact Number' />

            {/* Create Button */}
            <AuthButton label='Get Started' icon='send' onPress={() => { }} />

          </View>
        </View>
        <GestureDetector gesture={panGesture}>
          <View collapsable={false} style={styles.alreadyAcc}>
            <ImageBackground resizeMode="contain" source={require('../../images/objects.png')}
              style={styles.alreadyAcc}>
              <SwipeUpFooter text='Existing User?' link='Swipe Up' />
            </ImageBackground>
          </View>
        </GestureDetector>
      </GradientBackground>
    </SafeAreaView >
  );
};

export default CreateAccountScreen;

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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Rubik-Regular',
  },
});
