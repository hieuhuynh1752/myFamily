import React, {useState} from 'react';
import {Appbar, Card, Chip, TextInput, Avatar, Button} from 'react-native-paper';
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

const CreateEventScreen = ({navigation}) => {
  const {state} = useAuth();
  const [selectedMembers, setSelectedMembers] = useState(state.members);
  
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(false);
    console.log(currentDate)
    setStartDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTime(false);
    console.log(currentTime)
    setStartTime(currentTime);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(false);
    console.log(currentDate)
    setEndDate(currentDate);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowEndTime(false);
    console.log(currentTime)
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
    console.log(selectedMembers);
  };

  const handleUnselectMember = (id) => {
    console.log('unselect member: ' + id);
    setSelectedMembers((selectedMembers) =>
      selectedMembers.filter((member) => member.id !== id),
    );
    console.log(selectedMembers);
  };
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
          disabled="true"
          onPress={() => {}}
          size={28}
        />
      </Appbar.Header>
      <ScrollView>
        <TextInput label="Event title" style={styles.input} />
        <TextInput label="Description" style={styles.input} />
        <TextInput label="Location" style={styles.input} />
        <Card style={styles.container}>
          <Card.Title title="Participants" />
          <Card.Content>
            <View style={styles.row}>
              <RenderFamilyMembersChips />
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.container}>
          <Card.Title title="Start date" />
          <Card.Content>
            <View style={styles.row}>
              <Button onPress={showStartDatePicker}>Show start date</Button>
              <Button onPress={showStartTimePicker}>Show start time</Button>
            </View>
            <View style={styles.row}>
              <Button onPress={showEndDatePicker}>Show end date</Button>
              <Button onPress={showEndTimePicker}>Show end time</Button>
            </View>
            {showStartDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={onStartDateChange}
              />
            )}
            {showStartTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startTime}
                mode='time'
                is24Hour={true}
                display="default"
                onChange={onStartTimeChange}
              />
            )}
            {showEndDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endDate}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={onEndDateChange}
              />
            )}
            {showEndTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endTime}
                mode='time'
                is24Hour={true}
                display="default"
                onChange={onEndTimeChange}
              />
            )}
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
