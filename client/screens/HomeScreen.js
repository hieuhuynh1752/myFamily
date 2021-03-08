import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useAuth, LOGOUT} from '../context/userContext';

import {theme} from '../core/theme';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import PostScreen from './PostScreen';
import PostDetailsScreen from './PostDetailsScreen';
import CalendarScreen from './CalendarScreen';
import EventDetailsScreen from './EventDetailsScreen';
import CreateEventScreen from './CreateEventScreen';
import ToDoScreen from './ToDoScreen';
import CreateToDoScreen from './CreateToDoScreen';
import ManageScreen from './ManageScreen';

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

const BottomTabs = ({navigation}) => {
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Post"
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        labelStyle: {
          fontSize: 13,
        },
        keyboardHidesTabBar: true,
        
      }}>
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="file" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={ToDoScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="list" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Manage"
        component={ManageScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="settings" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeScreen = ({navigation}) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={BottomTabs}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{title: ''}}
      />
      <HomeStack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="CreateToDo"
        component={CreateToDoScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeScreen;
