import React from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {RowItem} from './component';
import {Header} from '../../common';
import {DayJs} from '../../utils';
import {StyleSheet} from 'react-native';

type Props = StackScreenProps<MainStackScreenType, 'Create'>;

export default ({route}: Props) => {
  const [date, setDate] = React.useState(DayJs.todayDate());
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  return (
    <View>
      {route.params.comingFrom === 'expense' ? (
        <RowItem text="Category">
          <Text>Hello</Text>
        </RowItem>
      ) : (
        <RowItem text="Mode of Payment">
          <Text>Hello</Text>
        </RowItem>
      )}
      <RowItem text="Amount">
        <Text>Hello</Text>
      </RowItem>
      <RowItem
        onPress={() => {
          setOpenDatePicker(!openDatePicker);
        }}
        text="Date">
        <Text>{date.format('DD/MM/YYYY')}</Text>
      </RowItem>
      <RowItem text="Remark">
        <Text>Hello</Text>
      </RowItem>

      {openDatePicker && (
        <DateTimePicker
          display={Platform.OS === 'android' ? 'default' : 'inline'}
          value={date.toDate()}
          mode={'date'}
          onChange={({nativeEvent}) => {
            // console.log(nativeEvent.timestamp);
            const newDate: string = nativeEvent.timestamp || date.toString();
          }}
        />
      )}

      <View>
        <Pressable style={styles.saveContainer}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  saveContainer: {
    backgroundColor: '#E35F84',
    alignSelf: 'center',
    padding: 7,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  saveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
});
