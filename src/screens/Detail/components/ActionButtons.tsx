import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default () => {
  return (
    <View style={styles.container}>
      <Text>Income</Text>
      <Text>Expense</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
