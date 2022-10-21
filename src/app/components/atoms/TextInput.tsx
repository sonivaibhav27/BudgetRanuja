import React from 'react';
import {StyleSheet, TextInput as RNTextInput, ViewStyle} from 'react-native';

type TextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  style?: ViewStyle;
};
const TextInput = (props: TextInputProps) => {
  return <RNTextInput style={styles.default} {...props} />;
};
const styles = StyleSheet.create({
  default: {},
});
export default TextInput;
