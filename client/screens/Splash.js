import React, {useState, useEffect} from 'react'
import {ActivityIndicator, View, StyleSheet} from 'react-native'
import {useAuth} from '../context/userContext'
import {useTheme} from 'react-native-paper';

const Splash = ({navigation})=>{
    const {state} = useAuth();
    const {colors} = useTheme();
    const [animating, setAnimating] = useState(true)
    useEffect(()=>{
        setTimeout(()=>{
            setAnimating(false);
            navigation.replace(
                state.access_token === '' ? 'Auth':'Home'
            )
        },5000)
    },[])

    return(
        <View style={[styles.container,{backgroundColor:colors.matcha}]}>
            <ActivityIndicator animating={animating} color="#ffffff" size="large" style={styles.activityIndicator}/>
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator:{
        alignItems: 'center',
        height:80,
    }
})