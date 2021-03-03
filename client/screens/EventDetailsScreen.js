import React, {useState, useEffect} from 'react';

//import UI components
import {
  Appbar,
  Card,
  Chip,
  TextInput,
  Avatar,
  Button,
  Menu,
  Text,
  Modal,
  Portal,
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
import {REQUEST_UPDATE_EVENT} from '../graphql/mutations/events/updateEvent';
import {REQUEST_DELETE_EVENT} from '../graphql/mutations/events/deleteEvent';

import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/Feather';

const EventDetailsScreen = ({route, navigation}) => {
  const {state} = useAuth();
  const {event} = route.params;
  console.log(event);
  const {members} = route.params;

  const [deleteVisible, setDeleteVisible] = useState(false);

  const [isInEditMode, setIsInEditMode] = useState(false);

  const [eventTitle, setEventTitle] = useState(event.title);

  const [eventDescription, setEventDescription] = useState(event.description);

  const [eventLocation, setEventLocation] = useState(event.location);

  const [eventColor, setEventColor] = useState(event.color);

  const [eventColorText, setEventColorText] = useState('');

  const [selectedMembers, setSelectedMembers] = useState(members);

  const [selectedMembersIds, setSelectedMembersIds] = useState(
    members.map((member) => member.id),
  );

  const [startDate, setStartDate] = useState(
    new Date(event.start_date_time.replace(/\s/g, 'T')),
  );
  const [startTime, setStartTime] = useState(
    new Date(event.start_date_time.replace(/\s/g, 'T')),
  );

  const [endDate, setEndDate] = useState(
    new Date(event.end_date_time.replace(/\s/g, 'T')),
  );
  const [endTime, setEndTime] = useState(
    new Date(event.end_date_time.replace(/\s/g, 'T')),
  );

  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const [recurrence, setRecurrence] = useState(event.recurrence);

  const [showColorMenu, setShowColorMenu] = useState(false);

  const [showRecurrenceMenu, setShowRecurrenceMenu] = useState(false);

  const openDelete = () => setDeleteVisible(true);
  const closeDelete = () => setDeleteVisible(false);

  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  const handleEditSelect = () => setIsInEditMode(true);
  const handleCompleteEdit = () => setIsInEditMode(false);

  const openRecurrenceMenu = () => setShowRecurrenceMenu(true);
  const closeRecurrenceMenu = () => setShowRecurrenceMenu(false);

  const openColorMenu = () => setShowColorMenu(true);
  const closeColorMenu = () => setShowColorMenu(false);

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

  const handleSubmitUpdateEvent = async () => {
    const startDateTime =
      startDate.toISOString().slice(0, 10) +
      ' ' +
      startTime.toISOString().slice(11, 19);

    const endDateTime =
      endDate.toISOString().slice(0, 10) +
      ' ' +
      endTime.toISOString().slice(11, 19);
    try {
      await requestUpdateEventMutation({
        variables: {
          id: event.id,
          title: eventTitle,
          description: eventDescription,
          start_date_time: startDateTime,
          end_date_time: endDateTime,
          color: eventColor,
          recurrence,
          location: eventLocation,
          participants_id: selectedMembersIds.toString(),
          reminder: 'null',
        },
      });
      handleCompleteEdit();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitDeleteEvent = async () => {
    try {
      await requestDeleteEventMutation();
      navigation.navigate('Calendar');
    } catch (error) {
      console.log(error);
    }
  };

  const [
    requestUpdateEventMutation,
    {loading: requestUpdateEventLoading},
  ] = useMutation(REQUEST_UPDATE_EVENT);

  const [
    requestDeleteEventMutation,
    {loading: requestDeleteEventLoading},
  ] = useMutation(REQUEST_DELETE_EVENT, {
    update(cache, {data: {deleteEvent}}) {
      cache.modify({
        fields: {
          events(existingEvents, {readField}) {
            const newEvents = existingEvents.filter(
              (eventRef) => readField('id', eventRef) !== deleteEvent.id,
            );
            return newEvents;
          },
        },
      });
    },
    variables: {
      id: parseInt(event.id),
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
    if (
      eventDescription === event.description &&
      eventLocation === event.location
    ) {
      if (
        eventTitle !== event.title &&
        selectedMembers !== undefined &&
        startDate <= endDate &&
        endTime > startTime
      ) {
        setSelectedMembersIds(selectedMembers.map((member) => member.id));
        setIsAbleToSubmit(true);
      }
    } else {
      setSelectedMembersIds(selectedMembers.map((member) => member.id));
      setIsAbleToSubmit(true);
    }
  }, [
    selectedMembers,
    eventTitle,
    eventDescription,
    eventLocation,
    startDate,
    endDate,
    startTime,
    endTime,
  ]);

  if (state.role === 'Admin' || memberId === state.memberId) return (
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: eventColor}}>
      <Loader loading={requestUpdateEventLoading} />
      <Appbar.Header style={{backgroundColor: theme.colors.card}}>
        {isInEditMode ? (
          <Appbar.Action
            icon="arrow-left"
            onPress={() => {
              setEventColor(event.color);
              setEventTitle(event.title);
              setEventDescription(event.description);
              setEventLocation(event.location);
              setSelectedMembers(members);
              setSelectedMembersIds(members.map((member) => member.id));
              setStartDate(new Date(event.start_date_time.replace(/\s/g, 'T')));
              setStartTime(new Date(event.start_date_time.replace(/\s/g, 'T')));
              setEndDate(new Date(event.end_date_time.replace(/\s/g, 'T')));
              setEndTime(new Date(event.end_date_time.replace(/\s/g, 'T')));
              setRecurrence(event.recurrence);
              handleCompleteEdit();
            }}
          />
        ) : (
          <Appbar.Action
            icon="arrow-left"
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}

        <Appbar.Content title="Event Details" style={{alignItems: 'center'}} />
        {isInEditMode ? (
          <Appbar.Action
            icon="check"
            disabled={!isAbleToSubmit}
            onPress={() => {
              handleSubmitUpdateEvent();
            }}
          />
        ) : (
          <Appbar.Action
            icon="edit"
            onPress={() => {
              handleEditSelect();
            }}
          />
        )}
      </Appbar.Header>
      <ScrollView>
        {isInEditMode ? (
          <>
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
                    icon="calendar"
                    mode="outlined"
                    color={theme.colors.text}
                    onPress={showStartDatePicker}
                    style={{
                      width: '61%',
                      margin: 4,
                      backgroundColor: theme.colors.border,
                    }}>
                    {startDate.toUTCString().slice(0, 16)}
                  </Button>
                  <Button
                    icon="clock"
                    mode="outlined"
                    color={theme.colors.text}
                    onPress={showStartTimePicker}
                    style={{
                      width: '33%',
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
                    End time cannot be earlier than Start time, please check
                    again!
                  </Paragraph>
                ) : null}
                <View style={styles.row}>
                  <Button
                    icon="calendar"
                    mode="outlined"
                    color={theme.colors.text}
                    onPress={showEndDatePicker}
                    style={{
                      width: '61%',
                      margin: 4,
                      backgroundColor: theme.colors.border,
                    }}>
                    {endDate.toUTCString().slice(0, 16)}
                  </Button>
                  <Button
                    icon="clock"
                    mode="outlined"
                    color={
                      startDate == endDate && endTime < startTime
                        ? theme.colors.error
                        : theme.colors.text
                    }
                    onPress={showEndTimePicker}
                    style={{
                      width: '33%',
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
            <Card style={styles.container}>
              <Card.Title title="Color" />
              <Card.Content>
                <View style={{flex: 2}}>
                  <View style={{flex: 8}}>
                    <Menu
                      visible={showColorMenu}
                      onDismiss={closeColorMenu}
                      style={{position: 'absolute', right: '17%', left: '17%'}}
                      anchor={
                        <Button
                          mode="outlined"
                          onPress={openColorMenu}
                          color={
                            eventColorText === ''
                              ? theme.colors.text
                              : '#ffffff'
                          }
                          style={{
                            width: '80%',
                            backgroundColor: eventColor,
                            alignSelf: 'center',
                          }}>
                          {eventColorText === '' ? '' : eventColorText}
                        </Button>
                      }>
                      <Menu.Item
                        icon={() => (
                          <Avatar.Text
                            color="#ffffff"
                            style={{backgroundColor: '#ff005c'}}
                            size={24}
                          />
                        )}
                        onPress={() => {
                          setEventColor('#ff005c');
                          setEventColorText('Red');
                          closeColorMenu();
                        }}
                        title="Red"
                      />
                      <Menu.Item
                        icon={() => (
                          <Avatar.Text
                            color="#ffffff"
                            style={{backgroundColor: '#845ec2'}}
                            size={24}
                          />
                        )}
                        onPress={() => {
                          setEventColor('#845ec2');
                          setEventColorText('Purple');
                          closeColorMenu();
                        }}
                        title="Purple"
                      />
                      <Menu.Item
                        icon={() => (
                          <Avatar.Text
                            color="#ffffff"
                            style={{backgroundColor: '#1a508b'}}
                            size={24}
                          />
                        )}
                        onPress={() => {
                          setEventColor('#1a508b');
                          setEventColorText('Blue');
                          closeColorMenu();
                        }}
                        title="Blue"
                      />
                      <Menu.Item
                        icon={() => (
                          <Avatar.Text
                            color="#ffffff"
                            style={{backgroundColor: '#6a492b'}}
                            size={24}
                          />
                        )}
                        onPress={() => {
                          setEventColor('#6a492b');
                          setEventColorText('Brown');
                          closeColorMenu();
                        }}
                        title="Brown"
                      />
                      <Menu.Item
                        icon={() => (
                          <Avatar.Text
                            color="#ffffff"
                            style={{backgroundColor: '#007965'}}
                            size={24}
                          />
                        )}
                        onPress={() => {
                          setEventColor('#007965');
                          setEventColorText('Green');
                          closeColorMenu();
                        }}
                        title="Green"
                      />
                    </Menu>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          <>
            <Card style={styles.container}>
              <Card.Title title="Event title" />
              <Card.Content>
                <Text style={{fontSize: 16}}>{eventTitle}</Text>
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Description" />
              <Card.Content>
                {eventDescription === '' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#aaaaaa',
                      fontStyle: 'italic',
                    }}>
                    {' '}
                    No description provided
                  </Text>
                ) : (
                  <Text style={{fontSize: 16}}>{eventDescription}</Text>
                )}
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Location" />
              <Card.Content>
                {eventLocation === '' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#aaaaaa',
                      fontStyle: 'italic',
                    }}>
                    {' '}
                    No location provided
                  </Text>
                ) : (
                  <Text style={{fontSize: 16}}>{eventLocation}</Text>
                )}
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Participants" />
              <Card.Content style={styles.row}>
                {state.members.map((member) =>
                  selectedMembers.find(
                    (selectedMember) => selectedMember.id === member.id,
                  ) !== undefined ? (
                    <Chip
                      key={member.id}
                      style={styles.selectedChip}
                      textStyle={styles.chipTextStyle}
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
                    <Paragraph key={member.id}></Paragraph>
                  ),
                )}
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Begin at" />
              <Card.Content style={styles.row}>
                <Icon
                  name="calendar"
                  size={20}
                  style={{marginRight: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {startDate.toUTCString().slice(0, 16)}
                </Text>
                <Text style={{fontSize: 16}}> - </Text>
                <Icon
                  name="clock"
                  size={20}
                  style={{marginHorizontal: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {startTime.toString().slice(16, 18) > 12
                    ? parseInt(startTime.toString().slice(16, 18)) -
                      12 +
                      startTime.toString().slice(18, 21) +
                      ' PM'
                    : startTime.toString().slice(16, 21) + ' AM'}
                </Text>
              </Card.Content>
              <Card.Title title="End at" />
              <Card.Content style={styles.row}>
                <Icon
                  name="calendar"
                  size={20}
                  style={{marginRight: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {endDate.toUTCString().slice(0, 16)}
                </Text>
                <Text style={{fontSize: 16}}> - </Text>
                <Icon
                  name="clock"
                  size={20}
                  style={{marginHorizontal: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {endTime.toString().slice(16, 18) > 12
                    ? parseInt(endTime.toString().slice(16, 18)) -
                      12 +
                      endTime.toString().slice(18, 21) +
                      ' PM'
                    : endTime.toString().slice(16, 21) + ' AM'}
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Repeat" />
              <Card.Content style={styles.row}>
                <Icon
                  name="repeat"
                  size={20}
                  style={{marginRight: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>{recurrence}</Text>
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Button
                icon="trash-2"
                mode="contained"
                onPress={openDelete}
                style={{backgroundColor: theme.colors.error}}>
                Delete
              </Button>
            </Card>
            <Portal>
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
                  <Card.Title
                    title="Delete event"
                    style={{alignSelf: 'center'}}
                  />
                  <Card.Content>
                    <Paragraph>
                      Are you sure you want to delete this event?
                    </Paragraph>
                    <Button
                      mode="contained"
                      color={theme.colors.background}
                      disabled={requestDeleteEventLoading}
                      onPress={() => {
                        closeDelete();
                      }}>
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      color={theme.colors.notification}
                      loading={requestDeleteEventLoading}
                      onPress={handleSubmitDeleteEvent}>
                      Delete
                    </Button>
                  </Card.Content>
                </Card>
              </Modal>
            </Portal>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  )
  else return(
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={{flex: 1, width: '100%', backgroundColor: eventColor}}>
      <Appbar.Header style={{backgroundColor: theme.colors.card}}>
          <Appbar.Action
            icon="arrow-left"
            onPress={() => {
              navigation.goBack();
            }}
          />
        <Appbar.Content title="Event Details" style={{alignItems: 'center'}} />
      </Appbar.Header>
      <ScrollView>
            <Card style={styles.container}>
              <Card.Title title="Event title" />
              <Card.Content>
                <Text style={{fontSize: 16}}>{eventTitle}</Text>
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Description" />
              <Card.Content>
                {eventDescription === '' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#aaaaaa',
                      fontStyle: 'italic',
                    }}>
                    {' '}
                    No description provided
                  </Text>
                ) : (
                  <Text style={{fontSize: 16}}>{eventDescription}</Text>
                )}
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Location" />
              <Card.Content>
                {eventLocation === '' ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#aaaaaa',
                      fontStyle: 'italic',
                    }}>
                    {' '}
                    No location provided
                  </Text>
                ) : (
                  <Text style={{fontSize: 16}}>{eventLocation}</Text>
                )}
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Participants" />
              <Card.Content style={styles.row}>
                {state.members.map((member) =>
                  selectedMembers.find(
                    (selectedMember) => selectedMember.id === member.id,
                  ) !== undefined ? (
                    <Chip
                      key={member.id}
                      style={styles.selectedChip}
                      textStyle={styles.chipTextStyle}
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
                    <Paragraph key={member.id}></Paragraph>
                  ),
                )}
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Begin at" />
              <Card.Content style={styles.row}>
                <Icon
                  name="calendar"
                  size={20}
                  style={{marginRight: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {startDate.toUTCString().slice(0, 16)}
                </Text>
                <Text style={{fontSize: 16}}> - </Text>
                <Icon
                  name="clock"
                  size={20}
                  style={{marginHorizontal: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {startTime.toString().slice(16, 18) > 12
                    ? parseInt(startTime.toString().slice(16, 18)) -
                      12 +
                      startTime.toString().slice(18, 21) +
                      ' PM'
                    : startTime.toString().slice(16, 21) + ' AM'}
                </Text>
              </Card.Content>
              <Card.Title title="End at" />
              <Card.Content style={styles.row}>
                <Icon
                  name="calendar"
                  size={20}
                  style={{marginRight: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {endDate.toUTCString().slice(0, 16)}
                </Text>
                <Text style={{fontSize: 16}}> - </Text>
                <Icon
                  name="clock"
                  size={20}
                  style={{marginHorizontal: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>
                  {endTime.toString().slice(16, 18) > 12
                    ? parseInt(endTime.toString().slice(16, 18)) -
                      12 +
                      endTime.toString().slice(18, 21) +
                      ' PM'
                    : endTime.toString().slice(16, 21) + ' AM'}
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.container}>
              <Card.Title title="Repeat" />
              <Card.Content style={styles.row}>
                <Icon
                  name="repeat"
                  size={20}
                  style={{marginRight: 5, marginBottom: 5}}
                />
                <Text style={{fontSize: 16}}>{recurrence}</Text>
              </Card.Content>
            </Card>
      </ScrollView>
    </ImageBackground>
  )
  ;
};

export default EventDetailsScreen;

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
