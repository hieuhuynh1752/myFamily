import React from 'react';
import Paragraph from '../components/Paragraph';
import {theme} from '../core/theme';
import {Card, Avatar, Appbar} from 'react-native-paper';

const ToDoScreen = ({navigation}) => {
  return (
    <Appbar.Header style={{backgroundColor: theme.colors.card}}>
      <Appbar.Action />
      <Appbar.Content title="To Do List" style={{alignItems: 'center', flex: 1}} />
      <Appbar.Action
        icon="plus"
        onPress={() => {
          navigation.navigate('CreateToDo');
        }}
        size={28}
      />
    </Appbar.Header>
  );
};

export default ToDoScreen;
