import React, {useState} from 'react';
import {
  Text,
  Button,
  Divider,
  Card,
  List,
  IconButton,
  Modal,
  Portal,
  TextInput,
  Switch,
  Menu,
} from 'react-native-paper';
import {ImageBackground, StyleSheet, ScrollView, View} from 'react-native';
import {useAuth, LOGOUT} from '../context/userContext';
import {theme} from '../core/theme';
import {} from '../components/TextInput';
import {emailValidator} from '../core/utils';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/Feather';
import {useMutation, useQuery} from '@apollo/client';
import {REQUEST_GET_INVITES_BY_MEMBERS} from '../graphql/query/getInvites';
import {REQUEST_CREATE_INVITE} from '../graphql/mutations/invites/createInvite';
import {REQUEST_UPDATE_FAMILY_MEMBER_ROLE} from '../graphql/mutations/familyMember/updateFamilyMemberRole';
import {REQUEST_DELETE_FAMILY_MEMBER} from '../graphql/mutations/familyMember/deleteFamilyMember';
import {INVITES_FRAGMENT} from '../graphql/fragments/invitesFragment';

const ManageScreen = ({navigation}) => {
  const {state, dispatch} = useAuth();
  const memberIds = state.members.map((member) => member.id);

  const [addMemberVisible, setAddMemberVisible] = useState(false);

  const [leaveFamilyVisible, setLeaveFamilyVisible] = useState(false);

  const openAddMemberModal = () => setAddMemberVisible(true);
  const closeAddMemberModal = () => setAddMemberVisible(false);

  const openLeaveFamilyModal = () => setLeaveFamilyVisible(true);
  const closeLeaveFamilyModal = () => setLeaveFamilyVisible(false);

  const [
    requestUpdateFamilyMemberRoleMutation,
    {loading: requestUpdateFamilyMemberRoleLoading},
  ] = useMutation(REQUEST_UPDATE_FAMILY_MEMBER_ROLE);

  const [
    requestDeleteFamilyMemberMutation,
    {loading: requestDeleteFamilyMemberLoading},
  ] = useMutation(REQUEST_DELETE_FAMILY_MEMBER);

  const [
    requestLeaveFamilyMutation,
    {loading: requestLeaveFamilyLoading},
  ] = useMutation(REQUEST_DELETE_FAMILY_MEMBER, {
    update(cache) {
      cache.modify({
        fields: {
          families(existingFamilies, {readField}) {
            const newFamilies = existingFamilies.filter(
              (familyRef) => readField('id', familyRef) != state.familyId,
            );
            return newFamilies;
          },
        },
      });
    },

    variables: {id: state.memberId},
  });

  const requestLeaveFamily = async () => {
    try {
      await requestLeaveFamilyMutation();
      navigation.navigate('Families');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    dispatch({type: LOGOUT});
    return navigation.dangerouslyGetParent().navigate('Auth');
  };

  const GetInvitedMembers = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_INVITES_BY_MEMBERS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;

    return (
      <>
        <Portal>
          <Modal
            visible={addMemberVisible}
            onDismiss={closeAddMemberModal}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              width: '80%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '900',
              }}>
              Invite new member
            </Text>
            <Divider style={{marginVertical: 9}} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
              }}>
              Please fill out the Email that you wanted to invite to join this
              family:
            </Text>
            <InviteNewFamilyMembers invites={data.invites} />
          </Modal>
        </Portal>
      </>
    );
  };

  const InviteNewFamilyMembers = ({invites}) => {
    const [addMemberError, setAddMemberError] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const [
      requestCreateInviteMutation,
      {loading: requestCreateInviteLoading},
    ] = useMutation(REQUEST_CREATE_INVITE, {
      variables: {
        memberid: state.memberId,
        email: receiverEmail,
        status: false,
      },
      update(cache, {data: {createInvite}}) {
        cache.modify({
          fields: {
            invites(existingInvites = []) {
              const newInviteRef = cache.writeFragment({
                data: createInvite,
                fragment: INVITES_FRAGMENT,
              });
              return [...existingInvites, newInviteRef];
            },
          },
        });
      },
    });

    const handleEmailChange = (event) => {
      setReceiverEmail(event);
      setAddMemberError('');
    };

    const requestCreateInvite = async () => {
      const emailError = emailValidator(receiverEmail);
      if (emailError) {
        return setAddMemberError(emailError);
      }
      if (
        invites.find((invite) => invite.email === receiverEmail) != undefined
      ) {
        return setAddMemberError(
          'This Email has been invited, please check again!',
        );
      }
      try {
        let response = await fetch(
          'https://api.emailjs.com/api/v1.0/email/send',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: 'user_kvNT9chb46JAgs79ueEhi',
              service_id: 'service_lhwih3k',
              template_id: 'template_q5f35tn',
              template_params: {
                from_name: state.user.name,
                from_family: state.familyName,
                to_email: receiverEmail,
              },
            }),
          },
        );
        let json = await response.toString();
        console.log(json);
        await requestCreateInviteMutation();
        closeAddMemberModal();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <>
        {addMemberError !== '' ? (
          <Text style={styles.error}>{addMemberError}</Text>
        ) : null}
        <TextInput
          value={receiverEmail}
          onChangeText={handleEmailChange}
          error={addMemberError !== ''}
          errorText={addMemberError}
          style={styles.input}
        />
        <View style={styles.row}>
          <Button
            mode="contained"
            color={theme.colors.background}
            style={{width: '50%'}}
            disabled={requestCreateInviteLoading}
            onPress={() => {
              closeAddMemberModal();
            }}>
            Cancel
          </Button>
          <Button
            mode="contained"
            color={theme.colors.accent}
            style={{width: '50%'}}
            loading={requestCreateInviteLoading}
            onPress={requestCreateInvite}>
            Invite
          </Button>
        </View>
      </>
    );
  };

  const ActionButtons = ({memberId, role, memberName}) => {
    if (state.role !== 'Admin') return null;
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [confirmUpdateVisible, setConfirmUpdateVisible] = useState(false);

    const [isSwitchOn, setIsSwitchOn] = useState(role === 'Admin');
    const baseState = role === 'Admin';

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const openEdit = () => setEditVisible(true);
    const closeEdit = () => setEditVisible(false);
    const openDelete = () => setDeleteVisible(true);
    const closeDelete = () => setDeleteVisible(false);
    const openUpdateConfirm = () => setConfirmUpdateVisible(true);
    const closeUpdateConfirm = () => setConfirmUpdateVisible(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const requestUpdateFamilyMemberRole = async () => {
      try {
        await requestUpdateFamilyMemberRoleMutation({
          variables: {
            id: parseInt(memberId),
            role: isSwitchOn ? 'Admin' : 'Member',
          },
        });
        closeUpdateConfirm();
      } catch (error) {
        console.log(error);
      }
    };

    const requestDeleteFamilyMember = async () => {
      try {
        await requestDeleteFamilyMemberMutation({
          variables: {id: parseInt(memberId)},
        });
        closeDelete();
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button mode="text" onPress={openMenu}>
              <Icon name="more-vertical" size={24} color={theme.colors.text} />
            </Button>
          }>
          <Menu.Item
            onPress={() => {
              openEdit();
              closeMenu();
            }}
            icon="edit"
            titleStyle={{color: 'green'}}
            title="Edit this member's role"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              openDelete();
              closeMenu();
            }}
            icon="trash-2"
            titleStyle={{color: 'red'}}
            title="Remove this member"
          />
        </Menu>
        <Portal>
          <Modal
            visible={editVisible}
            onDismiss={closeEdit}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              width: '80%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '900',
              }}>
              Edit {memberName}'s role
            </Text>
            <Divider style={{marginVertical: 9}} />
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  width: '80%',
                }}>
                is Administrator
              </Text>
              <Switch
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
                style={{width: '20%'}}
              />
            </View>
            <View style={styles.row}>
              <Button
                mode="contained"
                color={theme.colors.background}
                style={{width: '50%'}}
                onPress={() => {
                  closeEdit();
                }}>
                Cancel
              </Button>
              <Button
                mode="contained"
                color={theme.colors.accent}
                style={{width: '50%'}}
                disabled={isSwitchOn == baseState}
                onPress={() => {
                  openUpdateConfirm();
                }}>
                Update
              </Button>
            </View>
          </Modal>
          <Modal
            visible={confirmUpdateVisible}
            onDismiss={closeUpdateConfirm}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              width: '80%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '900',
              }}>
              Edit {memberName}'s role
            </Text>
            <Divider style={{marginVertical: 9}} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
              }}>
              Are you sure you want to set {memberName} as{' '}
              {isSwitchOn ? 'Administrator' : 'Member'} ?
            </Text>

            <View style={styles.row}>
              <Button
                mode="contained"
                color={theme.colors.background}
                style={{width: '50%'}}
                disabled={requestUpdateFamilyMemberRoleLoading}
                onPress={() => {
                  closeUpdateConfirm();
                }}>
                Cancel
              </Button>
              <Button
                mode="contained"
                color={theme.colors.accent}
                style={{width: '50%'}}
                disabled={requestUpdateFamilyMemberRoleLoading}
                loading={requestUpdateFamilyMemberRoleLoading}
                onPress={() => {
                  requestUpdateFamilyMemberRole();
                }}>
                Confirm
              </Button>
            </View>
          </Modal>
          <Modal
            visible={deleteVisible}
            onDismiss={closeDelete}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              width: '80%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '900',
              }}>
              Remove {memberName} from this family
            </Text>
            <Divider style={{marginVertical: 9}} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginVertical: 9,
              }}>
              Are you sure you want to remove {memberName} from this family?
            </Text>
            <Divider style={{marginVertical: 9}} />
            <View style={styles.row}>
              <Button
                mode="contained"
                color={theme.colors.background}
                style={{width: '50%'}}
                onPress={() => {
                  closeDelete();
                }}>
                Cancel
              </Button>
              <Button
                mode="contained"
                color={theme.colors.notification}
                style={{width: '50%'}}
                loading={requestDeleteFamilyMemberLoading}
                onPress={requestDeleteFamilyMember}>
                Delete
              </Button>
            </View>
          </Modal>
        </Portal>
      </>
    );
  };

  const MemberInfoAndActions = ({member}) => {
    console.log(member);
    const [viewMemberVisible, setViewMemberVisible] = useState(false);
    const openViewMemberModal = () => setViewMemberVisible(true);
    const closeViewMemberModal = () => setViewMemberVisible(false);
    return (
      <>
        <Card
          style={{
            elevation: 0,
            width: 85,
            height: 120,
            alignItems: 'center',
            backgroundColor: '#e8e8e8',
          }}>
          <Card.Content>
            <IconButton
              onPress={openViewMemberModal}
              size={40}
              icon="user"
              color="#ffffff"
              style={{
                alignSelf: 'center',
                backgroundColor: theme.colors.accent,
                elevation: 5,
                marginBottom: 5,
                marginTop: -2,
                marginHorizontal: 2,
              }}
            />
            <Text style={{alignSelf: 'center', marginHorizontal: 3, width: 70}}>
              {member.user.name}
            </Text>
          </Card.Content>
        </Card>
        <Portal>
          <Modal
            visible={viewMemberVisible}
            onDismiss={closeViewMemberModal}
            contentContainerStyle={{
              width: '90%',
              alignSelf: 'center',
            }}>
            <Card style={styles.container}>
              <Card.Title
                title={member.user.name + "'s info"}
                right={() => (
                  <ActionButtons
                    memberId={member.id}
                    role={member.role}
                    memberName={member.user.name}
                  />
                )}
              />
              <Card.Content>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: '900',
                  }}>
                  Current role in this family: {member.role}
                </Text>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#bbbfca',
      }}>
      <View style={{height: 120, backgroundColor: '#e8e8e8', elevation: 5}}>
        <ScrollView horizontal={true}>
          <Card
            style={{
              elevation: 0,
              width: 85,
              height: 120,
              alignItems: 'center',
              backgroundColor: '#e8e8e8',
            }}>
            <Card.Content>
              <IconButton
                onPress={openAddMemberModal}
                size={40}
                icon="plus"
                color="#ffffff"
                style={{
                  backgroundColor: '#7579e7',
                  elevation: 5,
                  marginBottom: 5,
                  marginTop: -2,
                  marginHorizontal: 2,
                }}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: '800',
                  marginHorizontal: 3,
                }}>
                Add new member
              </Text>
            </Card.Content>
          </Card>
          <GetInvitedMembers />
          {state.members.map((member) => (
            <MemberInfoAndActions member={member} key={member.id} />
          ))}
        </ScrollView>
      </View>
      <Card
        style={{
          width: '100%',
          alignSelf: 'center',
          elevation: 6,
          marginTop: 16,
        }}>
        <List.Item
          title="Switch family"
          left={() => (
            <Icon
              name="refresh-cw"
              size={23}
              color="#ffffff"
              style={{marginVertical: 10, marginHorizontal: 15}}
            />
          )}
          right={() => (
            <Icon
              name="chevron-right"
              size={23}
              color="#ffffff"
              style={{marginVertical: 10, marginHorizontal: 15}}
            />
          )}
          onPress={() => {
            navigation.navigate('Families');
            //navigation.dangerouslyGetParent().navigate('Families');
          }}
          titleStyle={{color: '#ffffff'}}
          style={{backgroundColor: '#f05454'}}
        />
      </Card>
      <Card
        style={{
          width: '100%',
          alignSelf: 'center',
          elevation: 6,
          marginTop: 16,
        }}>
        <List.Item
          title="About us"
          left={() => (
            <Icon
              name="info"
              size={23}
              style={{marginVertical: 10, marginHorizontal: 15}}
            />
          )}
          onPress={() => {}}
        />
        <Divider style={{height: 2}} />
        <List.Item
          title="Policy"
          left={() => (
            <Icon
              name="pocket"
              size={23}
              style={{marginVertical: 10, marginHorizontal: 15}}
            />
          )}
          onPress={() => {}}
        />
        <Divider style={{height: 2}} />
        <List.Item
          title="Help"
          left={() => (
            <Icon
              name="flag"
              size={23}
              style={{marginVertical: 10, marginHorizontal: 15}}
            />
          )}
          onPress={() => {}}
        />
      </Card>
      <Card
        style={{
          width: '90%',
          alignSelf: 'center',
          elevation: 6,
          marginTop: 16,
        }}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => {
              openLeaveFamilyModal();
            }}
            color="#e40017"
            style={{width: '90%', alignSelf: 'center', elevation: 8}}>
            <Text style={{color: '#ffffff'}}>Leave this Family</Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              handleLogout();
            }}
            color="#ffffff"
            style={{
              width: '90%',
              alignSelf: 'center',
              elevation: 6,
              marginTop: 16,
            }}>
            <Text style={{color: '#e40017'}}>Logout</Text>
          </Button>
        </Card.Content>
      </Card>
      <Portal>
        <Modal
          visible={leaveFamilyVisible}
          onDismiss={closeLeaveFamilyModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            width: '80%',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 19,
              fontWeight: '900',
            }}>
            Leave this family
          </Text>
          <Divider style={{marginVertical: 9}} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              marginVertical: 9,
            }}>
            Are you sure you want to leave this family? Your data in this Family
            will be lost.
          </Text>
          <Divider style={{marginVertical: 9}} />
          <View style={styles.row}>
            <Button
              mode="contained"
              color={theme.colors.background}
              style={{width: '50%'}}
              onPress={() => {
                closeLeaveFamilyModal();
              }}>
              Cancel
            </Button>
            <Button
              mode="contained"
              color={theme.colors.notification}
              style={{width: '50%'}}
              loading={requestLeaveFamilyLoading}
              onPress={requestLeaveFamily}>
              Leave
            </Button>
          </View>
        </Modal>
      </Portal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: -5,
    marginHorizontal: -5,
    alignSelf: 'center',
    elevation: 0,
  },
  row: {
    marginTop: 12,
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

export default ManageScreen;
