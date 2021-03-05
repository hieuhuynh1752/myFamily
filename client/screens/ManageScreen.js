import React, {useState, useEffect} from 'react';
import {Text, TextInput, Button} from 'react-native-paper';
import axios from 'axios';
import {useAuth} from '../context/userContext';
const ManageScreen = ({navigation}) => {
  const {state} = useAuth();
  console.log(state.user);
  const [receiverEmail, setReceiverEmail] = useState('');

  const handleEmailChange = (event) => setReceiverEmail(event);

  const handleEmailSubmit = async() => {
    // console.log("handle clicked");
    // return fetch('https://reactnative.dev/movies.json')
    // .then((response) => response.json())
    // .then((json) => {
    //     console.log('im here')
    //     return console.log(json.movies);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    // const data = {
    //   service_id: 'service_c9z0tjt',
    //   template_id: 'template_ip10elf',
    //   user_id: 'user_2QlJYUBBQpUd0msBs9DwJ',
    //   template_params: {
    //     from_name: state.user.name,
    //     from_family: state.familyName,
    //     to_email: receiverEmail,
    //   },
    // };

    try {
      let response = await fetch(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: 'user_2QlJYUBBQpUd0msBs9DwJ',
            service_id: 'service_c9z0tjt',
            template_id: 'template_ip10elf',
            template_params: {
              from_name: state.user.name,
              from_family: state.familyName,
              to_email: receiverEmail,
            },
          }),
        },
      );
        let json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }

    // try{
    //     console.log(data);
    //     console.log(JSON.stringify(data));
        // await axios({
        //     method: "POST",
        //     url:`https://api.emailjs.com/api/v1.0/email/send`,
        //     data: JSON.stringify(data),
        //     headers:{
        //         'Content-Type':'application/json'
        //     }
        // }).then(function(response){console.log(response.data)})

    //     await axios.post('https://httpbin.org/post',{
    //         hello:'world'
    //     }).then(function(response){console.log(response.data)})
    // }catch(e){
    //     console.log(e)
    // }
    // emailjs
    //   .send(
    //     'service_c9z0tjt',
    //     'template_ipelf',
    //     {

    //     },
    //     'user_2QlJYUBBQpUd0msBs9DwJ',
    //   )
    //   .then(
    //     (result) => {
    //       console.log(result.text);
    //     },
    //     (error) => {
    //       console.log(error.text);
    //     },
    //   );
  };

  return (
    <>
      <TextInput value={receiverEmail} onChangeText={handleEmailChange} />
      <Button mode="contained" onPress={handleEmailSubmit}>
        Send
      </Button>
    </>
  );
};

export default ManageScreen;
