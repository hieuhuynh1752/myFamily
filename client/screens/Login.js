import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useMutation} from '@apollo/client';
import {REQUEST_LOGIN} from '../graphql/mutations/authentication/login';
import {useAuth} from '../context/userContext';
import {LOGIN} from '../context/userContext';
import Loader from '../components/Loader';
import {useTheme, TextInput} from 'react-native-paper';

const Login = ({navigation}) => {
  const {colors} = useTheme();
  console.log(colors);
  const {state, dispatch} = useAuth();
  const [accountValues, setAccountValues] = useState({
    username: '',
    password: '',
  });
  const [errortext, setErrorText] = useState('');

  const passwordInputRef = createRef();

  const [requestLoginMutation, {loading: requestLoginLoading}] = useMutation(
    REQUEST_LOGIN,
    {
      update(proxy, {data: userData}) {
        dispatch({type: LOGIN, payload: userData.login});
      },
      variables: accountValues,
    },
  );

  const handleUsernameChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, username: event};
    });
  };

  const handlePasswordChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, password: event};
    });
  };

  const requestLogin = async () => {
    if (accountValues.username === '') {
      alert('Please fill Email');
      return;
    }
    if (accountValues.password === '') {
      alert('Please fill Password');
      return;
    }
    try {
      await requestLoginMutation();
      console.log(accountValues);
      navigation.replace('Home');
    } catch (error) {
      console.log(error);
      setErrorText('Incorrect Username or Password! Please check again.');
    }
  };

  return (
    <View style={[styles.mainBody, {backgroundColor: colors.matcha}]}>
      <Loader loading={requestLoginLoading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',

        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              {/* <Image
                source={require('../Image/aboutreact.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              /> */}
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                mode="outlined"
                label="Email"
                style={styles.inputStyle}
                onChangeText={handleUsernameChange}
                placeholder="Enter Email" //dummy@abc.com
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                mode="inline"
                style={[styles.inputStyle,{borderRadius:0}]}
                onChangeText={handlePasswordChange}
                placeholder="Enter Password" //12345
                label="Password"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={[styles.buttonStyle, {backgroundColor: colors.milo}]}
              activeOpacity={0.5}
              onPress={requestLogin}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('RegisterScreen')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  SectionStyle: {
    flexDirection: 'row',
    
  },
  buttonStyle: {
    borderWidth: 0,
    color: '#FFFFFF',
    height: 40,
    alignItems: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: '#ec4646',
    textAlign: 'center',
    fontSize: 14,
  },
});
