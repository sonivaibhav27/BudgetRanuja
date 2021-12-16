import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';

type Props = {
  loadingText?: string;
};

export default (props: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#000" />
      <Text style={styles.loadingText}>
        {props.loadingText || 'Loading...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    elevation: 1,
    alignSelf: 'center',
  },
  loadingText: {
    color: '#000',
    marginLeft: 20,
  },
});
