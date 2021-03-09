//React import
import React, {useState} from 'react';
//End of React import

//UI components import
import Paragraph from '../components/Paragraph';
import {ImageBackground, StyleSheet, ScrollView, View} from 'react-native';
import {
  Portal,
  Modal,
  Appbar,
  Card,
  Divider,
  Chip,
  TextInput,
  Avatar,
  Menu,
  Button,
  List,
  Text,
  Checkbox,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {theme} from '../core/theme';
import Loader from '../components/Loader';
//End of UI components import

//GraphQL Client import
import {useQuery, useMutation} from '@apollo/client';
import {REQUEST_GET_TO_DOS} from '../graphql/query/getToDos';
import {REQUEST_UPDATE_TO_DO} from '../graphql/mutations/todos/updateToDo';
import {REQUEST_UPDATE_TO_DO_STATUS} from '../graphql/mutations/todos/updateToDoStatus';
import {REQUEST_DELETE_TO_DO} from '../graphql/mutations/todos/deleteToDo';
//End of GraphQL Client import

//React Context import
import {useAuth} from '../context/userContext';
//End of React Context import

const ToDoScreen = ({navigation}) => {
  //Core States declaration
  const {state} = useAuth();
  const memberIds = state.members.map((member) => member.id);
  //End of Core States declaration
  
  //Core GraphQL Mutations declaration
  const [
    requestUpdateToDoMutation,
    {loading: requestUpdateToDoLoading},
  ] = useMutation(REQUEST_UPDATE_TO_DO);
  
  const [
    requestDeleteToDoMutation,
    {loading: requestDeleteToDoLoading},
  ] = useMutation(REQUEST_DELETE_TO_DO, {
    update(cache, {data: {deleteToDo}}) {
      cache.modify({
        fields: {
          toDos(existingToDos, {readField}) {
            const newToDos = existingToDos.filter(
              (toDoRef) => readField('id', toDoRef) !== deleteToDo.id,
            );
            return newToDos;
          },
        },
      });
    },
  });
  //End of Core GraphQL Mutations declaration

  //Get To Dos based on useQuery GraphQL Component
  const GetToDos = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_TO_DOS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;

    return data.toDos.map((toDo) => (
      <Card key={toDo.id} style={styles.container}>
        <ListItem
          toDo={toDo}
          assigneeName={
            state.members.find((member) => member.id === toDo.assignee_id).user
              .name
          }
        />
      </Card>
    ));
  };
  //End of Get To Dos based on useQuery GraphQL Component

  //List Item Component for Get To Dos Component
  const ListItem = ({toDo, assigneeName}) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(toDo.is_completed);
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);
    const handleCheck = () => setIsChecked(!isChecked);
    const [requestUpdateToDoStatusMutation] = useMutation(
      REQUEST_UPDATE_TO_DO_STATUS,
    );
    const requestUpdateToDoStatus = async (isCompleted) => {
      try {
        await requestUpdateToDoStatusMutation({
          variables: {
            id: parseInt(toDo.id),
            is_completed: isCompleted,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <>
        <List.Item
          title={toDo.name}
          onPress={showDialog}
          right={() => (
            <Checkbox.Android
              status={isChecked ? 'checked' : 'unchecked'}
              disabled={toDo.assignee_id != state.memberId}
              onPress={() => {
                handleCheck();
                requestUpdateToDoStatus(!isChecked);
              }}
            />
          )}
        />
        <Portal>
          <Modal visible={dialogVisible} onDismiss={hideDialog}>
            <Card style={styles.container}>
              <Card.Title
                title={toDo.name}
                subtitle={
                  'Created by: ' +
                  toDo.familyMember.user.name +
                  ' at:' +
                  new Date(toDo.created_at.replace(/\s/g, 'T'))
                    .toString()
                    .slice(0, 21)
                }
                right={() => (
                  <ActionButtons
                    memberId={toDo.familyMember.id}
                    toDoId={toDo.id}
                    title={toDo.name}
                    description={toDo.description}
                    assigneeId={toDo.assignee_id}
                    is_completed={toDo.is_completed}
                  />
                )}
              />
              <Card.Content>
                <Card>
                  <Card.Title title="Status" />
                  <Card.Content>
                    {toDo.is_completed ? (
                      <Paragraph color={theme.colors.accent}>
                        Completed
                      </Paragraph>
                    ) : (
                      <Paragraph>Pending</Paragraph>
                    )}
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Title title="Description" />
                  <Card.Content>
                    {toDo.description !== '' ? (
                      <Paragraph>{toDo.description}</Paragraph>
                    ) : (
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#aaaaaa',
                          fontStyle: 'italic',
                        }}>
                        No description provided
                      </Text>
                    )}
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Title title="Assigned to" />
                  <Card.Content>
                    <Chip
                      selected="true"
                      textStyle={styles.chipTextStyle}
                      style={styles.selectedChip}
                      icon={() => (
                        <Avatar.Icon
                          icon="check"
                          color={theme.colors.surface}
                          style={{backgroundColor: '#056676'}}
                          size={24}
                        />
                      )}>
                      {assigneeName}
                    </Chip>
                  </Card.Content>
                </Card>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </>
    );
  };
  //End of List Item Component for Get To Dos Component

  //Action Buttons Component for List Item Component
  const ActionButtons = ({
    memberId,
    toDoId,
    title,
    description,
    assigneeId,
    is_completed,
  }) => {
    if (state.role !== 'Admin' && memberId !== state.memberId) return null;
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [toDoTitle, setToDoTitle] = useState(title);
    const [toDoDescription, setToDoDescription] = useState(description);
    const [toDoAssigneeId, setToDoAssigneeId] = useState(assigneeId);
    const [memberIsAssigned, setMemberIsAssigned] = useState(true);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const openEdit = () => setEditVisible(true);
    const closeEdit = () => setEditVisible(false);
    const openDelete = () => setDeleteVisible(true);
    const closeDelete = () => setDeleteVisible(false);

    const handleEditTitle = (event) => {
      setToDoTitle(event);
    };

    const handleEditDescription = (event) => {
      setToDoDescription(event);
    };

    const handleSelectMember = (id) => {
      setMemberIsAssigned(true);
      setToDoAssigneeId(id);
    };

    const handleUnselectMember = () => {
      setMemberIsAssigned(false);
      setToDoAssigneeId('');
    };

    const requestUpdateToDo = async () => {
      try {
        await requestUpdateToDoMutation({
          variables: {
            id: parseInt(toDoId),
            assignee: parseInt(assigneeId),
            name: toDoTitle,
            description: toDoDescription,
          },
        });
        closeEdit();
      } catch (error) {
        console.log(error);
      }
    };

    const requestDeleteToDo = async () => {
      try {
        await requestDeleteToDoMutation({variables: {id: toDoId}});
        closeDelete();
      } catch (error) {
        console.log(error);
      }
    };

    const RenderFamilyMembersChips = () => {
      if (!memberIsAssigned)
        return (
          <>
            {state.members.map((member) => (
              <Chip
                key={member.id}
                onPress={() => {
                  handleSelectMember(member.id);
                }}
                textStyle={styles.chipTextStyle}
                style={styles.chip}
                icon={() => (
                  <Avatar.Text
                    label="H"
                    color={theme.colors.surface}
                    style={{backgroundColor: '#056676'}}
                    size={24}
                  />
                )}>
                {member.user.name}
              </Chip>
            ))}
          </>
        );
      else
        return (
          <>
            {state.members.map((member) =>
              member.id !== toDoAssigneeId ? (
                <Chip
                  key={member.id}
                  disabled="true"
                  textStyle={styles.chipTextStyle}
                  style={styles.chip}
                  icon={() => (
                    <Avatar.Text
                      label="H"
                      color={theme.colors.surface}
                      style={{backgroundColor: '#056676'}}
                      size={24}
                    />
                  )}>
                  {member.user.name}
                </Chip>
              ) : (
                <Chip
                  key={member.id}
                  onPress={() => {
                    handleUnselectMember(member.id);
                  }}
                  selected="true"
                  textStyle={styles.chipTextStyle}
                  style={styles.selectedChip}
                  icon={() => (
                    <Avatar.Icon
                      icon="check"
                      color={theme.colors.surface}
                      style={{backgroundColor: '#056676'}}
                      size={24}
                    />
                  )}>
                  {member.user.name}
                </Chip>
              ),
            )}
          </>
        );
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
            title="Edit"
            disabled={is_completed}
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              openDelete();
              closeMenu();
            }}
            icon="trash-2"
            titleStyle={{color: 'red'}}
            title="Delete"
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
              Edit To do task
            </Text>
            <Divider style={{marginVertical: 9}} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
              }}>
              Task title
            </Text>
            <TextInput
              value={toDoTitle}
              onChangeText={handleEditTitle}
              style={styles.input}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginVertical: 9,
              }}>
              Assign to:
            </Text>
            <View style={styles.row}>
              <RenderFamilyMembersChips />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginVertical: 9,
              }}>
              Task description:
            </Text>
            <TextInput
              value={toDoDescription}
              onChangeText={handleEditDescription}
              style={styles.input}
              multiline
              numberOfLines={6}
            />
            <Divider style={{marginVertical: 9}} />
            <View style={styles.row}>
              <Button
                mode="contained"
                style={{width: '50%'}}
                color={theme.colors.background}
                disabled={requestUpdateToDoLoading}
                onPress={() => {
                  closeEdit();
                }}>
                Cancel
              </Button>
              <Button
                mode="contained"
                style={{width: '50%'}}
                color={theme.colors.accent}
                disabled={
                  toDoTitle === '' ||
                  toDoDescription === '' ||
                  toDoAssigneeId === ''
                }
                loading={requestUpdateToDoLoading}
                onPress={requestUpdateToDo}>
                Update
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
              Delete To do task
            </Text>
            <Divider style={{marginVertical: 9}} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginVertical: 9,
              }}>
              Are you sure you want to delete this task?
            </Text>
            <Divider style={{marginVertical: 9}} />
            <View style={styles.row}>
              <Button
                mode="contained"
                style={{width: '50%'}}
                color={theme.colors.background}
                disabled={requestDeleteToDoLoading}
                onPress={() => {
                  closeDelete();
                }}>
                Cancel
              </Button>
              <Button
                mode="contained"
                style={{width: '50%'}}
                color={theme.colors.notification}
                loading={requestDeleteToDoLoading}
                onPress={requestDeleteToDo}>
                Delete
              </Button>
            </View>
          </Modal>
        </Portal>
      </>
    );
  };
  //End of Action Buttons Component for List Item Component

  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: '#ffd880'}}>
      <Appbar.Header style={{backgroundColor: theme.colors.card}}>
        <Appbar.Action />
        <Appbar.Content
          title="To Do List"
          style={{alignItems: 'center', flex: 1}}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate('CreateToDo');
          }}
          size={28}
        />
      </Appbar.Header>
      <ScrollView>
        <GetToDos />
      </ScrollView>
    </ImageBackground>
  );
};

export default ToDoScreen;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginVertical: 16,
    alignSelf: 'center',
    elevation: 6,
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
  },
  chip: {
    margin: 4,
  },
  selectedChip: {
    margin: 4,
    backgroundColor: '#a3d2ca',
  },
  chipTextStyle: {
    fontSize: 18,
  },
});
