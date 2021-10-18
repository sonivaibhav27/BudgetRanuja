import React from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';

const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'Octomber',
  'November',
  'December',
];

const StartYear = 2020;
const TodayYear = new Date().getFullYear();

const Years: number[] = [];

for (let i = StartYear; i <= TodayYear; i++) {
  Years.push(i);
}

export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text>Select Month</Text>
        <FlatList
          //   style={{backgroundColor: 'blue'}}
          contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          data={Months}
          keyExtractor={item => item}
          renderItem={({item}) => {
            return (
              <View style={styles.month}>
                <Text style={styles.monthTextStyle}>{item}</Text>
              </View>
            );
          }}
        />
        <Text>Select Year</Text>
        <FlatList
          contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          data={Years}
          keyExtractor={item => item.toString()}
          renderItem={({item}) => {
            return (
              <View style={styles.month}>
                <Text style={styles.monthTextStyle}>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    // justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 20,
  },
  wrapper: {
    backgroundColor: 'white',
    // height: 250,
    borderRadius: 10,
    // flexDirection: 'row',
    // justifyContent: 'center',
    padding: 10,
    // alignItems: 'center',
    flex: 1,
  },
  month: {
    backgroundColor: '#EEE',
    padding: 8,
    marginRight: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  monthTextStyle: {
    color: '#000',
  },
});
