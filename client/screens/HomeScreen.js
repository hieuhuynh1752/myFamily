import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useAuth, LOGOUT} from '../context/userContext';

import {theme} from '../core/theme';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Feather";

import PostScreen from './PostScreen';
import CalendarScreen from './CalendarScreen';
import ToDoScreen from './ToDoScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();
  console.log('render Home component');
  const handleLogout = () => {
    AsyncStorage.removeItem('@userInfo');
    dispatch({type: LOGOUT});
    navigation.replace('SplashScreen');
  };

  useEffect(()=>{
    navigation.addListener('beforeRemove',(e)=>{
      e.preventDefault();
    })
  },[navigation])

  return (
    <Tab.Navigator initialRouteName="Post" tabBarOptions={{
      activeTintColor: theme.colors.background,
      labelStyle:{
        fontSize:16,
      },
      activeBackgroundColor: theme.colors.primary,
      keyboardHidesTabBar:true 
    }}>
      <Tab.Screen name="Post" component={PostScreen} options={{
        tabBarLabel: 'Post',
        tabBarIcon:({color, size})=>(
          <Icon name='home' color={color} size={28}/>
        )
      }}/>
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{
        tabBarLabel: 'Calendar',
        tabBarIcon:({color, size})=>(
          <Icon name='calendar' color={color} size={28}/>
        )
      }}/>
      <Tab.Screen name="ToDo" component={ToDoScreen} options={{
        tabBarLabel: 'To Do',
        tabBarIcon:({color, size})=>(
          <Icon name='list' color={color} size={28}/>
        )
      }}/>
    </Tab.Navigator>
  );
};

export default HomeScreen;
