import React, {memo} from 'react';
import {TouchableOpacity,Image,StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const BackButton = ({goBack})=>{
    <TouchableOpacity onPress={goBack} style={styles.container}>
        <Image style={styles.image} source={require('../assets/arrow_back.png')}/>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:30+getStatusBarHeight(),
        left:15,
    },
    image:{
        width:30,
        height:30
    }
})

export default memo(BackButton);