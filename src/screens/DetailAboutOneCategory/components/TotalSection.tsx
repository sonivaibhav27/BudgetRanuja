import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default (props: {amount: number}) => {
  if (typeof props.amount !== 'undefined') {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Total : {props.amount}</Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    padding: 20,
  },
  textStyle: {
    fontSize: 25,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
