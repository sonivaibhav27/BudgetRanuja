import React from 'react';
import {StyleSheet, Text as RNText, TextStyle} from 'react-native';
import {UtilTypes} from '../../../types';

type TextProps = {
  children: JSX.Element | JSX.Element[] | string;
  style?: TextStyle;
  textType: UtilTypes.TTextType;
};

const returnStyleBasedOnTextType = (textType: TextProps['textType']) => {
  switch (textType) {
    case 'heading':
      return styles.heading;
    case 'subheading':
      return styles.subHeading;
    case 'normal':
      return styles.normal;
    case 'paragraph':
      return styles.paragraph;
  }
};

const Text = (props: TextProps) => {
  const stylesBasedOnTextType = returnStyleBasedOnTextType(props.textType);
  return (
    <RNText
      style={[props.style, stylesBasedOnTextType]}
      allowFontScaling={false}>
      {props.children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  heading: {},
  subHeading: {},
  normal: {},
  paragraph: {},
});
export default Text;
