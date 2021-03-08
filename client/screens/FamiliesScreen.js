import React, {useState} from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

import {useQuery, useMutation} from '@apollo/client';
import {
  REQUEST_CREATE_FAMILY,
  REQUEST_CREATE_FAMILY_MEMBER,
} from '../graphql/mutations/familyMember/createFamily';

import {REQUEST_GET_FAMILIES} from '../graphql/query/getFamilies';
import {useAuth, SELECT_FAMILY} from '../context/userContext';
import {theme} from '../core/theme';

import {Portal, Modal, Card} from 'react-native-paper';
import Loader from '../components/Loader';

import {nameValidator} from '../core/utils';

const FamiliesScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();

  const GetFamilies = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_FAMILIES, {
      variables: {userid: state.user.id},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;
    return data.families.map((family) => (
      <Button
        mode="contained"
        onPress={() => handleSelectFamily(family)}
        color={theme.colors.primary}
        key={family.id}>
        {family.family.name}
      </Button>
    ));
  };

  const [newFamily, setNewFamily] = useState({
    name: '',
  });
  const [newFamilyMember, setNewFamilyMember] = useState({
    userid: state.user.id,
    familyid: '',
    role: 'Admin',
  });
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [familyNameErrorText, setFamilyNameErrorText] = useState('');

  const showModal = () => setModalIsVisible(true);
  const hideModal = () => setModalIsVisible(false);

  const handleNewFamilyChange = (event) => {
    setFamilyNameErrorText('');
    setNewFamily((previousState) => {
      return {...previousState, name: event};
    });
  };

  const handleSelectFamily = (family) => {
    //console.log(family);
    dispatch({type: SELECT_FAMILY, payload: family});
    navigation.replace('Home');
  };

  const [
    requestCreateFamilyMutation,
    {loading: requestCreateFamilyLoading},
  ] = useMutation(REQUEST_CREATE_FAMILY, {
    update(proxy, {data: familyData}) {
      setNewFamilyMember((previousState) => {
        return {...previousState, familyid: familyData.createFamily.id};
      });
    },
    variables: newFamily,
  });

  const [
    requestCreateFamilyMemberMutation,
    {loading: requestCreateFamilyMemberLoading},
  ] = useMutation(REQUEST_CREATE_FAMILY_MEMBER, {
    update(proxy, {data: familyMemberData}) {
      dispatch({
        type: SELECT_FAMILY,
        payload: familyMemberData.createFamilyMember,
      });
    },
    variables: newFamilyMember,
  });

  const requestCreateFamily = async () => {
    const familyNameError = nameValidator(newFamily.name);
    if (familyNameError) {
      return setFamilyNameErrorText(familyNameError);
    }
    try {
      await requestCreateFamilyMutation();
      await requestCreateFamilyMemberMutation();
      hideModal();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Background>
      <Loader loading={requestCreateFamilyLoading}/>
      <Loader loading={requestCreateFamilyMemberLoading}/>
      <Header>Select your family</Header>
      <GetFamilies userId={{userid: state.user.id}} />
      <Paragraph color={theme.colors.text}>- Or -</Paragraph>
      <Portal>
        <Modal
          visible={modalIsVisible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            width: '80%',
            alignSelf: 'center',
          }}>
          <Card>
            <Card.Title
              title="Create new Family"
              style={{alignSelf: 'center'}}
            />
            <Card.Content>
              <Paragraph color={theme.colors.text}>
                Please enter your family name:
              </Paragraph>
              <TextInput
                label="Family name"
                value={newFamily.name}
                error={familyNameErrorText !== ''}
                errorText={familyNameErrorText}
                onChangeText={handleNewFamilyChange}
                autoCapitalize="none"
              />
              <Button
                mode="contained"
                color={theme.colors.surface}
                onPress={requestCreateFamily}>
                Create
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
      <Button
        mode="contained"
        color={theme.colors.secondary}
        onPress={showModal}>
        Create new family
      </Button>
    </Background>
  );
};

export default FamiliesScreen;
