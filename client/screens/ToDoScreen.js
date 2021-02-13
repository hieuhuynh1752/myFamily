import React from 'react';
import Paragraph from '../components/Paragraph';
import { theme } from '../core/theme';

const ToDoScreen = ({navigation}) =>{
    return <Paragraph color={theme.colors.text}>This is To Do screen</Paragraph>
}

export default ToDoScreen;