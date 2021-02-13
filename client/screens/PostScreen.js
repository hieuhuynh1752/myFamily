import React from 'react';
import Paragraph from '../components/Paragraph';
import { theme } from '../core/theme';
import CustomIcon from '../components/CustomIcon';

const PostScreen = ({navigation}) =>{
    return <Paragraph color={theme.colors.text}><CustomIcon name="home" size={24} />This is Post screen</Paragraph>
}

export default PostScreen;