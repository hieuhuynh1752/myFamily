import React from 'react';
import Paragraph from '../components/Paragraph';
import {theme} from '../core/theme';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar, Appbar} from 'react-native-paper';
import Loader from '../components/Loader';

//import graphql queries, mutations & fragments
import {useQuery} from '@apollo/client';
import {REQUEST_GET_EVENTS} from '../graphql/query/getEvents';
//end of graphql imports

//import user context
import {useAuth} from '../context/userContext';

const CalendarScreen = ({navigation}) => {
  const {state} = useAuth();
  const memberIds = state.members.map((member) => member.id);

  const GetEvents = () => {
    const {loading, error, data} = useQuery(REQUEST_GET_EVENTS, {
      variables: {membersid: memberIds},
    });
    if (loading) return <Loader loading={loading} />;
    if (error) return null;

    const allEvents = data.events.map((event) => {
      return {
        [event.start_date_time.slice(0, 10)]: [event],
      };
    });
    const refinedEvents = [];
    const finalEventsObject = {};
    allEvents.forEach((event) => {
      if (
        refinedEvents.find(
          (object) => Object.keys(object)[0] == Object.keys(event)[0],
        ) === undefined
      ) {
        refinedEvents.push(event);
      } else {
        const key = Object.keys(event)[0];
        const existingEvent = refinedEvents.find(
          (event) => Object.keys(event)[0] == key,
        );
        if (existingEvent[key][0] === undefined) {
          const updatedEvent = {
            [key]: [existingEvent[key], event[key]],
          };
          refinedEvents[
            refinedEvents.findIndex((event) => Object.keys(event)[0] == key)
          ] = updatedEvent;
        } else {
          //console.log(event[key][0]);
          existingEvent[key].push(event[key][0]);
        }
      }
    },[]);

    refinedEvents.forEach((event) => Object.assign(finalEventsObject, event));

    const renderItem = (item) => {
      const members = item.participants_id.split(',');
      const selectedMembers = members.map((userid) =>
        state.members.find((member) => member.id === userid),
      );
      return item.color === '' ? (
        <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
          <Card
          style={{marginTop:15}}
            onPress={() => {
              navigation.navigate('EventDetails', {
                event: item,
                members: selectedMembers,
              });
            }}>
            <Card.Title title={item.title} />
          </Card>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={{marginRight: 10, marginTop: 17,}}>
          <Card
            style={{backgroundColor: item.color,marginTop:15}}
            onPress={() => {
              navigation.navigate('EventDetails', {
                event: item,
                members: selectedMembers,
              });
            }}>
            <Card.Title  titleStyle={{ color:'#ffffff'}} title={item.title} />
          </Card>
        </TouchableOpacity>
      );
    };

    const renderEmptyDate = () => {
      console.log('renderEmptyData');
      return (
        <View style={styles.emptyDate}>
          <Paragraph>Oops, seems like there is no event this day!</Paragraph>
        </View>
      );
    };

    return (
      <View style={{flex: 1}}>
        <Agenda
          items={finalEventsObject}
          selected={new Date().toISOString().slice(0, 10)}
          renderItem={renderItem}
          renderEmptyData={renderEmptyDate}
          minDate={'2018-05-10'}
          pastScrollRange={5}
          futureScrollRange={5}
        />
      </View>
    );
  };

  return (
    <>
      <Appbar.Header style={{backgroundColor: theme.colors.card}}>
        <Appbar.Action />
        <Appbar.Content
          title="Events"
          style={{alignItems: 'center', flex: 1}}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate('CreateEvent');
          }}
          size={28}
        />
      </Appbar.Header>
      <GetEvents />
    </>
  );
};

const styles = StyleSheet.create({
  emptyDate: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    marginVertical: '50%',
  },
});

export default CalendarScreen;
