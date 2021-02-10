import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {
  SplashScreen,
  LoginScreen,
  HomeScreen,
  RegisterScreen
} from '../screens';

const Stack = createStackNavigator();

const Auth = () =>{
  return(
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: '' ,headerTransparent:true}}/>
    </Stack.Navigator>
  )
}

const Navigator = ()=>{
    return(
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Auth" component={Auth} options={{headerShown:false}}/>
          <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
    )
}

export default Navigator