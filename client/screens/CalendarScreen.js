//React import
import React from 'react';
//End React import

//UI Components import
import Paragraph from '../components/Paragraph';
import {theme} from '../core/theme';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Appbar} from 'react-native-paper';
import Loader from '../components/Loader';
//End UI Components import

//GraphQL Client import 
import {useQuery} from '@apollo/client';
import {REQUEST_GET_EVENTS} from '../graphql/query/getEvents';
//end of GraphQL Client import

//React context import
import {useAuth} from '../context/userContext';
//End React context import

const CalendarScreen = ({navigation}) => {
  //Core States declaration
  const {state} = useAuth();
  const memberIds = state.members.map((member) => member.id);
  //End of Core States declaration

  //GetEvents Component using GraphQL
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
  //End of GetEvents Component using GraphQL

  //Core Component return
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
  //End of Core Component return
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
