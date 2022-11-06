import React from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {UtilTypes} from '../../../types';
import {Text, Pressable} from '../atoms';

type PressableButtonType = {
  onPress: () => void;
  text: string;
  style?: ViewStyle | ViewStyle[];
  textType: UtilTypes.TTextType;
  textStyle?: TextStyle;
  disabled?: boolean;
};
const PresableButton = (props: PressableButtonType) => {
  return (
    <Pressable
      disabled={props.disabled}
      style={props.style}
      onPress={props.onPress}>
      <Text style={props.textStyle} textType={props.textType}>
        {props.text}
      </Text>
    </Pressable>
  );
};

PresableButton.defaultProps = {
  textType: 'paragraph',
};

export default PresableButton;
