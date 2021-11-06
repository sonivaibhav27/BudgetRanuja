import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  title: string;
  children?: ReactElement;
};

export default (props: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.childrenContainer}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  childrenContainer: {
    paddingVertical: 10,
  },
});
