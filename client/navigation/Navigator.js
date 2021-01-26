import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {useAuth} from '../context/userContext'

import Login from '../pages/Login';
import Home from '../pages/Home';

const Stack = createStackNavigator();

const Navigator = ()=>{
    const {state} = useAuth();

    return(
        <Stack.Navigator>
            {state.access_token==="" ? (
              <Stack.Screen
              name="SignIn"
              component={Login}
              options={{
                title: 'Sign in',
                animationTypeForReplace: state.access_token==="" ? 'pop' : 'push',
              }}
            />
            ) : (
              <Stack.Screen
                name="Home"
                component={Home}
              />
            )}
          </Stack.Navigator>
    )
}

export default Navigator