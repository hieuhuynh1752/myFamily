import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Register from '../screens/Register';

const Stack = createStackNavigator();

const Auth = () =>{
  return(
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={Login} options={{headerShown:false}}/>
      <Stack.Screen name="RegisterScreen" component={Register} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}

const Navigator = ()=>{
    return(
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" component={Splash} options={{headerShown:false}}/>
          <Stack.Screen name="Auth" component={Auth} options={{headerShown:false}}/>
          <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
    )
}

export default Navigator