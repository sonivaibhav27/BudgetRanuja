import React from 'react';
import {TextInput, TextStyle, ViewStyle} from 'react-native';

interface Props {
  value: string;
  onChangeText: (e: string) => void;
  keyboardType?: 'number-pad';
  maxLength?: number;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  style: ViewStyle & TextStyle;
  placeholder?: string;
}

const Input = React.forwardRef<TextInput, Props>((props, ref) => {
  return (
    <TextInput
      style={[{padding: 0}, props.style]}
      value={props.value}
      onChangeText={props.onChangeText}
      keyboardType={props.keyboardType || 'default'}
      maxLength={props.maxLength}
      ref={ref}
      returnKeyType={'next'}
      onSubmitEditing={props.onSubmitEditing}
      autoFocus={props.autoFocus}
      placeholder={props.placeholder}
      placeholderTextColor="#999"
    />
  );
});

Input.defaultProps = {
  autoFocus: false,
  onSubmitEditing: () => {},
};

export default Input;
