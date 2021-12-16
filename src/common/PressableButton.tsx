import React from 'react';
import {Pressable, ViewStyle} from 'react-native';

interface Props {
  children: JSX.Element | JSX.Element[];
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disable?: boolean;
}

export default (props: Props) => {
  return (
    <Pressable
      disabled={props.disable}
      android_ripple={{
        color: '#EEE',
      }}
      style={props.style}
      onPress={props.onPress}>
      {props.children}
    </Pressable>
  );
};
