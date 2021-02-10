import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useMutation} from '@apollo/client';
import {REQUEST_REGISTER} from '../graphql/mutations/authentication/register';
import {useAuth,REGISTER} from '../context/userContext';
import Loader from '../components/Loader';

const Register = ({navigation}) => {
  const {state, dispatch} = useAuth();
  
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordConfirmInputRef = createRef();
  
  const [accountValues, setAccountValues] = useState({
    name: '',
    email:'',
    password: '',
    password_confirmation:''
  });

  const [errorText, setErrorText] = useState('');

  const [requestRegisterMutation, {loading: requestRegisterLoading}] = useMutation(
    REQUEST_REGISTER,
    {
      update(proxy, {data: userData}) {
        dispatch({type: REGISTER, payload: userData.register.tokens});
      },
      variables: accountValues,
    },
  );

  const handleUsernameChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, name: event};
    });
  };

  const handleEmailChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, email: event};
    });
  };

  const handlePasswordChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, password: event};
    });
  };

  const handlePasswordConfirmChange = (event) => {
    setAccountValues((previousState) => {
      return {...previousState, password_confirmation: event};
    });
  };

  const requestRegister = async () => {
    if (accountValues.name==='') {
      alert('Please fill Name');
      return;
    }
    if (accountValues.email==='') {
      alert('Please fill Email');
      return;
    }
    if (accountValues.password==='') {
      alert('Please fill Password');
      return;
    }
    if (accountValues.password_confirmation==='') {
      alert('Please fill Address');
      return;
    }
    if (accountValues.password_confirmation!==accountValues.password) {
      alert('Password and Password Confirm are not the same! Please check again.');
      return;
    }
    try {
      await requestRegisterMutation();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error.message);
      setErrorText('This account has been registered before.');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#307ecc'}}>
      <Loader loading={requestRegisterLoading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
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
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={handleUsernameChange}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={handlePasswordChange}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                passwordConfirmInputRef.current &&
                passwordConfirmInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={handlePasswordConfirmChange}
              underlineColorAndroid="#f000"
              placeholder="Password confirm"
              placeholderTextColor="#8b9cb5"
              secureTextEntry={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          {errorText != '' ? (
            <Text style={styles.errorTextStyle}>
              {errorText}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={requestRegister}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});