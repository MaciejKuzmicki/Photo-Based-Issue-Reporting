import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen.tsx';
import RegisterScreen from './src/screens/RegisterScreen.tsx';
import HomeScreen from './src/screens/HomeScreen.tsx';
import AddDefectScreen from './src/screens/AddDefectScreen.tsx';
import DefectDetailsScreen from './src/screens/DefectDetailsScreen.tsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{title: 'Register'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="AddDefect"
          component={AddDefectScreen}
          options={{title: 'New Defect'}}
        />
        <Stack.Screen
          name="Defect"
          component={DefectDetailsScreen}
          options={{title: 'Defect Details'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
