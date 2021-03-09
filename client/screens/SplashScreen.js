import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {useAuth, LOGIN_BY_CACHE} from '../context/userContext';
import {theme} from '../core/theme';
import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();
  const [animating, setAnimating] = useState(true);
  
  const getStorageItem = async () => {
    const savedState = await AsyncStorage.getItem('@userInfo');
    const savedStateInObject = JSON.parse(savedState);
    //console.log(savedState);
    //console.log(savedStateInObject);
    if (
      savedStateInObject !== null &&
      savedStateInObject.access_token != ""
    ) {
      dispatch({type: LOGIN_BY_CACHE, payload: savedStateInObject});
      return navigation.navigate('Home');
    } else return navigation.navigate('Auth');
  };

  useEffect(() => {
    setTimeout(() => {
      getStorageItem();
      setAnimating(false);
    }, 3000);
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.primary}]}>
      <ActivityIndicator
        animating={animating}
        color="#ffffff"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
