import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

export default ({onPress}: {onPress: () => void}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.textStyle}>Go to Detail</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: '#F5951E',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
