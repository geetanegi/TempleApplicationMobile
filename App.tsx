import { StyleSheet, Text, useColorScheme } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from './src/screens/Auth/Login';

const App = () => {
  // useColorScheme is a hook that returns the current color scheme of the device
  // It can return 'light', 'dark', or 'no-preference'
  // If the theme is 'dark', we will use a dark background and light text color
  // If the theme is 'light', we will use a light background and dark text color
  const theme = useColorScheme();
  console.log('Current theme:', theme);
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  return (
    <SafeAreaView style={[styles.container,{ backgroundColor }]}>
      <Login/>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily:'Rubik'
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
})