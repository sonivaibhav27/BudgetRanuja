import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Theme} from '../../../theme&styles';

export default (props: {amount: number}) => {
  if (typeof props.amount !== 'undefined') {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Total Amount : {props.amount}</Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    elevation: 2,
  },
  textStyle: {
    fontSize: 24,
    color: Theme.ColorsTheme.primary,
    textAlign: 'center',
    fontWeight: '700',
  },
});
