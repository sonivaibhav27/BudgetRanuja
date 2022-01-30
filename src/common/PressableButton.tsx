import React from 'react';
import {Pressable, ViewStyle} from 'react-native';

interface Props {
  children: JSX.Element | JSX.Element[] | null;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disable?: boolean;
  hitSlop?: any;
}

export default (props: Props) => {
  return (
    <Pressable
      hitSlop={props.hitSlop}
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
