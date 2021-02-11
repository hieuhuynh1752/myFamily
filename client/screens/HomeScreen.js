import React from 'react';
import { View } from 'react-native';
import {Container, Button, Content, Form, Item, Input, Text} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {useAuth, LOGOUT} from '../context/userContext';

const HomeScreen = ({navigation}) => {
  const {state,dispatch} = useAuth();
  console.log(state);
  const handleLogout = () => {
    AsyncStorage.removeItem('@userInfo');
    dispatch({ type: LOGOUT });
    navigation.replace('SplashScreen');
  };

  return (
    <Container>
      <Content>
        <View>
          <Text>{state.user.name}</Text>
          <Text>{state.user.email}</Text>
          <Text>Family Id: {state.familyId}</Text>
          <Text>Family Name: {state.familyName}</Text>
          <Text>Family member Id: {state.memberId}</Text>
        </View>

        <Button full onPress={handleLogout}>
          <Text>Log Out</Text>
        </Button>
      </Content>
    </Container>
  );
};

export default HomeScreen;
