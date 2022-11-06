import React from 'react';
import {
  KeyboardType,
  StyleSheet,
  TextInput as RNTextInput,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../../theme';

type TextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  style?: ViewStyle;
  keyboardType?: KeyboardType;
  maxLength?: number;
};
const TextInput = (props: TextInputProps) => {
  return (
    <RNTextInput
      textBreakStrategy="balanced"
      placeholderTextColor={COLORS.placeholder}
      style={[styles.default, props.style]}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      selectionColor={COLORS.primary}
      keyboardType={props.keyboardType || 'default'}
      maxLength={props.maxLength}
    />
  );
};
const styles = StyleSheet.create({
  default: {
    fontFamily: 'Poppins-Regular',
  },
});
export default TextInput;
