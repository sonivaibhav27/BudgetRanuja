import React from 'react';
import {Pressable as RNPressable, ViewStyle} from 'react-native';
type Props = {
  children: JSX.Element | JSX.Element[];
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
};

const Pressable = (props: Props) => {
  return (
    <RNPressable
      android_ripple={{
        color: '#EEE',
      }}
      disabled={props.disabled}
      style={props.style}
      onPress={props.onPress}>
      {props.children}
    </RNPressable>
  );
};
Pressable.defaultProps = {
  disabled: false,
};
export default Pressable;
