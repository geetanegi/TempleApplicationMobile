import { StatusBar } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './src/screens/Auth/Auth';
// import { MainAppTabs } from './navigation/MainAppTabs';
const RootStack = createStackNavigator();
const App = () => {

  const isLoggedIn = false; // Replace with real auth logic

  return (
    <NavigationContainer >
      <StatusBar
        backgroundColor="transparent" // Android
        barStyle="dark-content"       // Android + iOS (dark icons)
        translucent={true}
        hidden={true}           // Allows content to render under the status bar
      />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name="MainApp" component={AuthNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default App
