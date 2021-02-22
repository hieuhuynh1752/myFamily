import React, {useState} from 'react';
import Paragraph from '../components/Paragraph';
import { theme } from '../core/theme';
import {View, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar} from 'react-native-paper';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

const CalendarScreen = ({navigation}) =>{
    const [items, setItems] = useState({'2021-02-22': [{name: 'item 1 - any js object'}],
    '2021-02-23': [{name: 'item 2 - any js object', height: 80}],
    '2021-02-24': [],
    '2021-02-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]});

  const loadItems = (day) => {
    
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Paragraph>{item.name}</Paragraph>
              <Avatar.Text label="J" />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        selected={'2021-02-19'}
        renderItem={renderItem}
        minDate={'2018-05-10'}
      />
    </View>
  );
}

export default CalendarScreen;