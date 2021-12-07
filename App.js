import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import JoinChatScreen from './screens/JoinChatScreen';
import ChatScreen from './screens/ChatScreen'


const Stack = createStackNavigator(); 
const globalScreenOptions = {
  headerStyle: {backgroundColor: "#3cb3ab"},
  headerTitleScreen: {color: "white"},
  headerTintColor: "white"
}
export default function App() {
  return (
    <NavigationContainer>
    <StatusBar style="light" />
      <Stack.Navigator 
        // initialRouteName='Home' 
        screenOptions={globalScreenOptions}
      >
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='JoinChat' component={JoinChatScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />





      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
