//React import
import React from 'react';
//End of React import

//Stack Navigator import
import {createStackNavigator} from '@react-navigation/stack';
//End of Stack Navigator import

//Screens Components import
import {
  SplashScreen,
  LoginScreen,
  HomeScreen,
  RegisterScreen,
  FamiliesScreen,
} from '../screens';
//End of Screens Components import

//Create Stack Navigator declaration
const Stack = createStackNavigator();
//End of Create Stack Navigator declaration

//Authentication Screens Stack Component
const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{title: '', headerTransparent: true}}
      />
    </Stack.Navigator>
  );
};
//End of Authentication Screens Stack Component

//Core Navigator Component
const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Stack.Screen
        name="Families"
        component={FamiliesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
//End of Core Navigator Component

export default Navigator;
