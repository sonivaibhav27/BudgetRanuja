import React from 'react';
import {Pressable, TextStyle, ViewStyle} from 'react-native';
import {UtilTypes} from '../../../types';
import Text from './Text';

type PressableButtonType = {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
  textType: UtilTypes.TTextType;
  textStyle?: TextStyle;
};
const PresableButton = (props: PressableButtonType) => {
  return (
    <Pressable>
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
