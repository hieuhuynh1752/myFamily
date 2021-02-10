import React,{useState, createRef} from 'react';
import {StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,} from 'react-native';
import {useMutation} from '@apollo/client';
import {REQUEST_LOGIN} from '../graphql/mutations/authentication/login';
import {useAuth} from '../context/userContext';
import {LOGIN} from '../context/userContext'
import Loader from '../components/Loader';

const Login = ({navigation}) => {
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
    };
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
      setErrorText('Incorrect Username or Password! Please check again.')
    }
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={requestLoginLoading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
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
                style={styles.inputStyle}
                onChangeText={handleUsernameChange}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#ffffff"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={handlePasswordChange
                }
                placeholder="Enter Password" //12345
                placeholderTextColor="#ffffff"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
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
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
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
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
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