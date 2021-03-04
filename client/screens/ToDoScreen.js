import React, {useState} from 'react';
import Paragraph from '../components/Paragraph';
import {ImageBackground, StyleSheet, ScrollView} from 'react-native';
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
  Button
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import {theme} from '../core/theme';

import {useQuery, useMutation} from '@apollo/client';
import {REQUEST_GET_TO_DOS} from '../graphql/query/getToDos';
import {REQUEST_UPDATE_TO_DO} from '../graphql/mutations/todos/updateToDo';
import {REQUEST_DELETE_TO_DO} from '../graphql/mutations/todos/deleteToDo';
import {TODOS_FRAGMENT} from '../graphql/fragments/todosFragment';

import {useAuth} from '../context/userContext';
import Loader from '../components/Loader';

const ToDoScreen = ({navigation}) => {
  const {state} = useAuth();
  const memberIds = state.members.map((member) => member.id);
  
  const GetToDos = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_TO_DOS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;

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
                  (toDoRef) => readField('id', toDoRef) !== deletePost.id,
                );
                return newToDos;
              },
            },
          });
        },
      });

      const requestUpdateToDo = async () => {
        try {
          await requestUpdateToDoMutation({
            variables: {
              id: parseInt(toDoId),
              assignee: parseInt(assigneeId),
              name: toDoTitle,
              description: toDoDescription,
              is_completed,
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
                <Icon
                  name="more-vertical"
                  size={24}
                  color={theme.colors.text}
                />
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
              <Card>
                <Card.Title
                  title="Edit To do task"
                  style={{alignSelf: 'center'}}
                />
                <Card.Content>
                  <TextInput
                    label="Task title"
                    value={toDoTitle}
                    onChangeText={handleEditTitle}
                    style={styles.input}
                  />
                  <Card style={styles.container}>
                    <Card.Title title="Assign to" />
                    <Card.Content>
                      <View style={styles.row}>
                        <RenderFamilyMembersChips />
                      </View>
                    </Card.Content>
                  </Card>
                  <TextInput
                    label="Task description"
                    value={toDoDescription}
                    onChangeText={handleEditDescription}
                    style={styles.input}
                    multiline
                    numberOfLines={15}
                  />
                  <Button
                    mode="contained"
                    color={theme.colors.background}
                    disabled={requestUpdateToDoLoading}
                    onPress={() => {
                      // setEditToDo({id: parseInt(postId), content: content});
                      closeEdit();
                    }}>
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    color={theme.colors.accent}
                    disabled={toDoTitle===""||toDoDescription===""||toDoAssigneeId===""}
                    loading={requestUpdateToDoLoading}
                    onPress={requestUpdateToDo}>
                    Update
                  </Button>
                </Card.Content>
              </Card>
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
              <Card>
                <Card.Title title="Delete To Do Task" style={{alignSelf: 'center'}} />
                <Card.Content>
                  <Paragraph>
                    Are you sure you want to delete this task?
                  </Paragraph>
                  <Button
                    mode="contained"
                    color={theme.colors.background}
                    disabled={requestDeleteToDoLoading}
                    onPress={() => {
                      closeDelete();
                    }}>
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    color={theme.colors.notification}
                    loading={requestDeleteToDoLoading}
                    onPress={requestDeleteToDo}>
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        </>
      );
    };
    return data.toDos.map((toDo)=>(
      <Card key={toDo.id} style={styles.container}>

      </Card>
    ))
  };

  return (
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
    fontSize: 18,
    width: '90%',
    alignSelf: 'center',
    elevation: 6,
    marginTop: 16,
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

