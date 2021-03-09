//React import
import React, {useState} from 'react';
//End of React import

//UI Components import
import {Appbar, Card, Chip, TextInput, Avatar} from 'react-native-paper';
import {theme} from '../core/theme';
import {ImageBackground, StyleSheet, ScrollView, View} from 'react-native';
import Loader from '../components/Loader';
//End of UI Components import

//React Context import
import {useAuth} from '../context/userContext';
//End of React Context import

//GraphQL Client import
import {useMutation} from '@apollo/client';
import {REQUEST_CREATE_TO_DO} from '../graphql/mutations/todos/createToDo';
import {TODOS_FRAGMENT} from '../graphql/fragments/todosFragment';
//End of GraphQL Client import

const CreateToDoScreen = ({navigation}) => {
  //Core States declaration
  const {state} = useAuth();

  const [taskTitle, setTaskTitle] = useState('');

  const [taskDescription, setTaskDescription] = useState('');

  const [selectedMember, setSelectedMember] = useState('');

  const [memberIsAssigned, setMemberIsAssigned] = useState(false);
  //End of Core States declaration

  //Core Task state handlers declaration
  const handleTaskTitleChange = (event) => {
    setTaskTitle(event);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event);
  };

  const handleSelectMember = (id) => {
    setMemberIsAssigned(true);
    setSelectedMember(id);
  };

  const handleUnselectMember = () => {
    setMemberIsAssigned(false);
    setSelectedMember('');
  };

  const handleSubmitCreateToDo = async () => {
    try {
      await requestCreateToDoMutation({
        variables: {
          memberid: state.memberId,
          assignee: parseInt(selectedMember),
          name: taskTitle,
          description: taskDescription,
          is_completed: false,
        },
      });
      navigation.navigate('ToDo');
    } catch (error) {
      console.log(error);
    }
  };
  //End of Core Task state handlers declaration

  //GraphQL Create To Do Task Mutation declaration
  const [
    requestCreateToDoMutation,
    {loading: requestCreateToDoLoading},
  ] = useMutation(REQUEST_CREATE_TO_DO, {
    update(cache, {data: {createToDo}}) {
      cache.modify({
        fields: {
          toDos(existingToDos = []) {
            const newToDoRef = cache.writeFragment({
              data: createToDo,
              fragment: TODOS_FRAGMENT,
            });
            return [...existingToDos, newToDoRef];
          },
        },
      });
    },
  });
  //End of GraphQL Create To Do Task Mutation declaration

  //FamilyMemberChips Component declaration
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
            member.id !== selectedMember ? (
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
  //End of FamilyMemberChips Component declaration

  //Core Component return
  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: theme.colors.accent}}>
      <Loader loading={requestCreateToDoLoading} />
      <Appbar.Header style={{backgroundColor: theme.colors.card}}>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title="Create To Do Task"
          style={{alignItems: 'center'}}
        />
        <Appbar.Action
          icon="check"
          disabled={taskTitle === '' || selectedMember === ''}
          onPress={() => {
            handleSubmitCreateToDo();
          }}
        />
      </Appbar.Header>
      <ScrollView>
        <TextInput
          label="Task title"
          value={taskTitle}
          onChangeText={handleTaskTitleChange}
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
          value={taskDescription}
          onChangeText={handleTaskDescriptionChange}
          style={styles.input}
          multiline
          numberOfLines={15}
        />
      </ScrollView>
    </ImageBackground>
  );
  //End of Core Component return
};

export default CreateToDoScreen;

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
