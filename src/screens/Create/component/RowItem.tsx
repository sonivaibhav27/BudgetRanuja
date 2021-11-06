import React, {ReactElement} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
interface Props {
  text: string;
  children: ReactElement;
  onPress?: () => void;
}

export default (props: Props) => {
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      <Text style={styles.textStyle}>{props.text}</Text>
      <View style={styles.valueContainer}>{props.children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    // backgroundColor: '#F3F3F3',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  textStyle: {
    flex: 0.5,
    color: '#000',
    fontWeight: '600',
    marginRight: 15,
  },
});
