import React from 'react';
import { View } from 'react-native';
import {Container, Button, Content, Form, Item, Input, Text} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {useAuth} from '../context/userContext';

export const LOGOUT = "LOGOUT";

const Home = () => {
  const {state,dispatch} = useAuth();

  const handleLogout = () => {
    AsyncStorage.removeItem('$userInfo');
    dispatch({ type: LOGOUT });
  };

  return (
    <Container>
      <Content>
        <View>
          <Text>{state.user.name}</Text>
          <Text>{state.user.email}</Text>
        </View>

        <Button full onPress={handleLogout}>
          <Text>Log Out</Text>
        </Button>
      </Content>
    </Container>
  );
};

export default Home;
