import React from 'react';
import {StyleSheet, View} from 'react-native';

export default () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(89,93,229)',
    flex: 1,
    alignSelf: 'stretch',
  },
});
