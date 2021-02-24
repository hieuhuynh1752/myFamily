import React, {useState, useEffect} from 'react';
import {
  Appbar,
  Card,
  Chip,
  TextInput,
  Avatar,
  Button,
  Menu,
} from 'react-native-paper';
import {theme} from '../core/theme';
import {
  ImageBackground,
  StyleSheet,
  ScrollView,
  Keyboard,
  View,
} from 'react-native';
import {useAuth} from '../context/userContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Paragraph from '../components/Paragraph';

import {useMutation} from '@apollo/client';
import {REQUEST_CREATE_EVENT} from '../graphql/mutations/events/createEvent';
import {EVENTS_FRAGMENT} from '../graphql/fragments/eventsFragment';

const CreateEventScreen = ({navigation}) => {
  const {state} = useAuth();

  const [eventTitle, setEventTitle] = useState('');

  const [eventDescription, setEventDescription] = useState('');

  const [eventLocation, setEventLocation] = useState('');

  const [selectedMembers, setSelectedMembers] = useState(state.members);

  const [selectedMembersIds, setSelectedMembersIds] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const [recurrence, setRecurrence] = useState('Never');

  const [showRecurrenceMenu, setShowRecurrenceMenu] = useState(false);

  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  const openRecurrenceMenu = () => setShowRecurrenceMenu(true);

  const closeRecurrenceMenu = () => setShowRecurrenceMenu(false);

  const handleEventTitleChange = (event) => {
    setEventTitle(event);
  };

  const handleEventDescriptionChange = (event) => {
    setEventDescription(event);
  };

  const handleEventLocationChange = (event) => {
    setEventLocation(event);
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(false);
    setStartDate(currentDate);
    setEndDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTime(false);
    setStartTime(currentTime);
    setEndTime(currentTime);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(false);
    setEndDate(currentDate);
    setEndTime(currentDate);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowEndTime(false);
    console.log(currentTime);
    setEndTime(currentTime);
  };

  const showStartDatePicker = () => {
    setShowStartDate(true);
  };

  const showStartTimePicker = () => {
    setShowStartTime(true);
  };

  const showEndDatePicker = () => {
    setShowEndDate(true);
  };

  const showEndTimePicker = () => {
    setShowEndTime(true);
  };

  const handleSelectMember = (id) => {
    console.log('select member: ' + id);
    setSelectedMembers((selectedMembers) =>
      selectedMembers.concat(
        state.members.filter((member) => member.id === id),
      ),
    );
  };

  const handleUnselectMember = (id) => {
    console.log('unselect member: ' + id);
    setSelectedMembers((selectedMembers) =>
      selectedMembers.filter((member) => member.id !== id),
    );
  };

  handleSubmitCreateEvent = async () => {
    const startDateTime =
      startDate.toISOString().slice(0, 10) +
      ' ' +
      startTime.toISOString().slice(11, 19);

    const endDateTime =
      endDate.toISOString().slice(0, 10) +
      ' ' +
      endTime.toISOString().slice(11, 19);
    try {
      await requestCreateEventMutation({
        variables: {
          memberid: state.memberId,
          title: eventTitle,
          description: eventDescription,
          start_date_time: startDateTime,
          end_date_time: endDateTime,
          color: '',
          recurrence,
          location: eventLocation,
          participants_id: selectedMembersIds.toString(),
          reminder: 'null',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [
    requestCreateEventMutation,
    {loading: requestCreateEventLoading},
  ] = useMutation(REQUEST_CREATE_EVENT, {
    update(cache, {data: {createEvent}}) {
      // cache.modify({
      //   fields: {
      //     events(existingEvents = []) {
      //       const newEventRef = cache.writeFragment({
      //         data: createEvent,
      //         fragment: EVENTS_FRAGMENT,
      //       });
      //       return [...existingEvents, newEventRef];
      //     },
      //   },
      // });
    },
  });

  const RenderFamilyMembersChips = () => {
    return (
      <>
        {state.members.map((member) =>
          selectedMembers.find(
            (selectedMember) => selectedMember.id === member.id,
          ) !== undefined ? (
            <Chip
              key={member.id}
              selected="true"
              onPress={() => {
                handleUnselectMember(member.id);
              }}
              style={styles.selectedChip}
              textStyle={styles.chipTextStyle}
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
          ) : (
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
          ),
        )}
      </>
    );
  };

  useEffect(() => {
    console.log(eventTitle);
    if (
      selectedMembers !== undefined &&
      eventTitle !== '' &&
      startDate <= endDate &&
      endTime > startTime
    ) {
      setSelectedMembersIds(selectedMembers.map((member) => member.id));
      setIsAbleToSubmit(true);
    }
  }, [selectedMembers, eventTitle, startDate, endDate, startTime, endTime]);

  return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: theme.colors.accent}}>
      <Appbar.Header style={{backgroundColor: theme.colors.card}}>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title="Create New Event"
          style={{alignItems: 'center'}}
        />
        <Appbar.Action
          icon="check"
          disabled={!isAbleToSubmit}
          onPress={() => {
            handleSubmitCreateEvent();
          }}
          size={28}
        />
      </Appbar.Header>
      <ScrollView>
        <TextInput
          label="Event title"
          value={eventTitle}
          onChangeText={handleEventTitleChange}
          style={styles.input}
        />
        <TextInput
          label="Description"
          value={eventDescription}
          onChangeText={handleEventDescriptionChange}
          style={styles.input}
        />
        <TextInput
          label="Location"
          value={eventLocation}
          onChangeText={handleEventLocationChange}
          style={styles.input}
        />
        <Card style={styles.container}>
          <Card.Title title="Participants" />
          <Card.Content>
            <View style={styles.row}>
              <RenderFamilyMembersChips />
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.container}>
          <Card.Title title="Start date time" />
          <Card.Content>
            <View style={styles.row}>
              <Button
                mode="outlined"
                color={theme.colors.text}
                onPress={showStartDatePicker}
                style={{
                  width: '75%',
                  margin: 4,
                  backgroundColor: theme.colors.border,
                }}>
                {startDate.toUTCString().slice(0, 16)}
              </Button>
              <Button
                mode="outlined"
                color={theme.colors.text}
                onPress={showStartTimePicker}
                style={{
                  width: '20%',
                  margin: 4,
                  backgroundColor: theme.colors.border,
                }}>
                {startTime.toString().slice(16, 21)}
              </Button>
            </View>
            {showStartDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onStartDateChange}
                minimumDate={new Date()}
              />
            )}
            {showStartTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onStartTimeChange}
              />
            )}
          </Card.Content>
        </Card>
        <Card style={styles.container}>
          <Card.Title title="End date time" />
          <Card.Content>
            {startDate == endDate && endTime < startTime ? (
              <Paragraph color={theme.colors.error}>
                End time cannot be earlier than Start time, please check again!
              </Paragraph>
            ) : null}
            <View style={styles.row}>
              <Button
                mode="outlined"
                color={theme.colors.text}
                onPress={showEndDatePicker}
                style={{
                  width: '75%',
                  margin: 4,
                  backgroundColor: theme.colors.border,
                }}>
                {endDate.toUTCString().slice(0, 16)}
              </Button>
              <Button
                mode="outlined"
                color={
                  startDate == endDate && endTime < startTime
                    ? theme.colors.error
                    : theme.colors.text
                }
                onPress={showEndTimePicker}
                style={{
                  width: '20%',
                  margin: 4,
                  backgroundColor: theme.colors.border,
                }}>
                {endTime.toString().slice(16, 21)}
              </Button>
            </View>
            {showEndDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onEndDateChange}
                minimumDate={startDate}
              />
            )}
            {showEndTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onEndTimeChange}
              />
            )}
          </Card.Content>
        </Card>
        <Card style={styles.container}>
          <Card.Title title="Recurrence" />
          <Card.Content>
            <View style={{flex: 2}}>
              <View style={{flex: 8}}>
                <Menu
                  visible={showRecurrenceMenu}
                  onDismiss={closeRecurrenceMenu}
                  style={{position: 'absolute', right: '17%', left: '17%'}}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={openRecurrenceMenu}
                      color={theme.colors.text}
                      style={{
                        width: '80%',
                        backgroundColor: theme.colors.border,
                        alignSelf: 'center',
                      }}>
                      {recurrence}
                    </Button>
                  }>
                  <Menu.Item
                    onPress={() => {
                      setRecurrence('Never');
                      closeRecurrenceMenu();
                    }}
                    title="Never"
                  />
                  <Menu.Item
                    onPress={() => {
                      setRecurrence('Daily');
                      closeRecurrenceMenu();
                    }}
                    title="Daily"
                  />
                  <Menu.Item
                    onPress={() => {
                      setRecurrence('Weekly');
                      closeRecurrenceMenu();
                    }}
                    title="Weekly"
                  />
                  <Menu.Item
                    onPress={() => {
                      setRecurrence('Monthly');
                      closeRecurrenceMenu();
                    }}
                    title="Monthly"
                  />
                  <Menu.Item
                    onPress={() => {
                      setRecurrence('Yearly');
                      closeRecurrenceMenu();
                    }}
                    title="Yearly"
                  />
                </Menu>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
};

export default CreateEventScreen;

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
