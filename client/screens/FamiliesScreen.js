import React, {useState} from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {StyleSheet, View} from 'react-native';
import {useQuery, useMutation} from '@apollo/client';
import {
  REQUEST_CREATE_FAMILY,
  REQUEST_CREATE_FAMILY_MEMBER,
} from '../graphql/mutations/familyMember/createFamily';

import {REQUEST_GET_FAMILIES} from '../graphql/query/getFamilies';
import {REQUEST_GET_INVITES_BY_EMAIL} from '../graphql/query/getInvites';
import {REQUEST_UPDATE_INVITE_STATUS} from '../graphql/mutations/invites/updateInviteStatus';
import {REQUEST_DELETE_INVITE} from '../graphql/mutations/invites/deleteInvite';

import {useAuth, SELECT_FAMILY} from '../context/userContext';
import {theme} from '../core/theme';

import {
  Portal,
  Modal,
  Card,
  Button as PureButton,
  Divider,
  Text,
  List,
  IconButton,
} from 'react-native-paper';
import Loader from '../components/Loader';

import {nameValidator} from '../core/utils';

const FamiliesScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();

  const [isFamilyListSelected, setIsFamilyListSelected] = useState(true);
  const [isInvitationListSelected, setIsInvitationListSelected] = useState(
    false,
  );

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

  const handleSwitchToFamilyTab = () => {
    setIsFamilyListSelected(true);
    setIsInvitationListSelected(false);
  };

  const handleSwitchToInvitationTab = () => {
    setIsInvitationListSelected(true);
    setIsFamilyListSelected(false);
  };
  const showModal = () => setModalIsVisible(true);
  const hideModal = () => setModalIsVisible(false);

  const handleNewFamilyChange = (event) => {
    setFamilyNameErrorText('');
    setNewFamily((previousState) => {
      return {...previousState, name: event};
    });
  };

  const handleSelectFamily = (family) => {
    dispatch({type: SELECT_FAMILY, payload: family});
    navigation.replace('Home');
  };

  const [
    requestCreateFamilyMutation,
    {loading: requestCreateFamilyLoading},
  ] = useMutation(REQUEST_CREATE_FAMILY, {
    update(cache, {data: familyData}) {
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
    update(cache, {data: familyMemberData}) {
      dispatch({
        type: SELECT_FAMILY,
        payload: familyMemberData.createFamilyMember,
      });
    },
    variables: newFamilyMember,
  });

  const [requestDeleteInviteMutation] = useMutation(REQUEST_DELETE_INVITE, {
    update(cache, {data: {deleteInvite}}) {
      cache.modify({
        fields: {
          invites(existingInvites, {readField}) {
            const newInvites = existingInvites.filter(
              (inviteRef) => readField('id', inviteRef) !== deleteInvite.id,
            );
            return newInvites;
          },
        },
      });
    },
  });

  const [requestUpdateInviteStatusMutation] = useMutation(
    REQUEST_UPDATE_INVITE_STATUS,
    {
      update(cache, {data: {updateInviteStatus}}) {
        cache.modify({
          fields: {
            invites(existingInvites, {readField}) {
              const newInvites = existingInvites.filter(
                (inviteRef) =>
                  readField('id', inviteRef) !== updateInviteStatus.id,
              );
              return newInvites;
            },
          },
        });
      },
    },
  );

  const handleApproveInvite = async (invite) => {
    try {
      await requestUpdateInviteStatusMutation({
        variables: {
          id: invite.id,
          status: true,
        },
      });
      await requestCreateFamilyMemberMutation({
        variables: {
          userid: state.user.id,
          familyid: invite.familyMember.family.id,
          role: 'Member',
        },
      });
      return navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteInvite = async (invite) => {
    try {
      await requestDeleteInviteMutation({
        variables: {id: invite.id},
      });
    } catch (error) {
      console.log(error);
    }
  };

  const requestCreateFamily = async () => {
    const familyNameError = nameValidator(newFamily.name);
    if (familyNameError) {
      return setFamilyNameErrorText(familyNameError);
    }
    try {
      await requestCreateFamilyMutation();
      await requestCreateFamilyMemberMutation();
      hideModal();
      return navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  const GetFamilies = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_FAMILIES, {
      variables: {userid: state.user.id},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;
    if (data.families.length == 0)
      return (
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: '800',
            marginHorizontal: 3,
          }}>
          Oops! You didn't join any family yet.
        </Text>
      );
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

  const GetInvites = () => {
    console.log(state.user.email);
    const {loading, error, data} = useQuery(REQUEST_GET_INVITES_BY_EMAIL, {
      variables: {email: state.user.email},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;
    console.log(data.invites);
    if (data.invites.length == 0)
      return (
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: '800',
            marginHorizontal: 3,
          }}>
          Oops! There is no invitation.
        </Text>
      );
    return data.invites.map((invite) => (
      <Card
        key={invite.id}
        style={{marginVertical: 5, elevation: 3, width: '100%'}}>
        <List.Item
          mode="contained"
          title={invite.familyMember.family.name}
          description={'Invited by ' + invite.familyMember.user.name}
          right={() => (
            <>
              <IconButton
                icon="check"
                color="#00917c"
                size={23}
                onPress={() => handleApproveInvite(invite)}
              />
              <IconButton
                icon="x"
                color={theme.colors.error}
                size={23}
                onPress={() => handleDeleteInvite(invite)}
              />
            </>
          )}
        />
      </Card>
    ));
  };

  return (
    <Background>
      <Loader loading={requestCreateFamilyLoading} />
      <Loader loading={requestCreateFamilyMemberLoading} />
      <Header>Select your family</Header>
      <Card style={styles.container}>
        <View style={styles.row}>
          <PureButton
            mode="contained"
            color={isFamilyListSelected ? '#ffffff' : theme.colors.background}
            style={{width: '50%', elevation: 0}}
            onPress={() => {
              //closeLeaveFamilyModal();
              if (!isFamilyListSelected) {
                handleSwitchToFamilyTab();
              }
            }}>
            My Families
          </PureButton>
          <PureButton
            mode="contained"
            color={
              isInvitationListSelected ? '#ffffff' : theme.colors.background
            }
            style={{width: '50%', elevation: -2}}
            onPress={() => {
              if (!isInvitationListSelected) {
                handleSwitchToInvitationTab();
              }
            }}>
            Invitations
          </PureButton>
          <Divider style={{marginVertical: 9}} />
          <Card.Content
            style={{width: '100%', height: 250, justifyContent: 'center'}}>
            {isFamilyListSelected ? <GetFamilies /> : null}
            {isInvitationListSelected ? <GetInvites /> : null}
          </Card.Content>
        </View>
      </Card>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 5,
    alignSelf: 'center',
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: 16,
    width: '100%',
    alignSelf: 'center',
    elevation: 0,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default FamiliesScreen;
