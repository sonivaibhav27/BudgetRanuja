import React from 'react';
import {StyleSheet, Text as RNText, TextStyle} from 'react-native';
import {UtilTypes} from '../../../types';
import {COLORS} from '../../theme';

type TextProps = {
  children: JSX.Element | string | number | (string | JSX.Element)[];
  style?: TextStyle | TextStyle[];
  textType: UtilTypes.TTextType;
  numberOfLines?: number;
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
      numberOfLines={props.numberOfLines}
      style={[stylesBasedOnTextType, props.style]}
      allowFontScaling={false}>
      {props.children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    fontSize: 23,
  },
  subHeading: {
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.black,
    // top: 2,
  },
  normal: {
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    fontSize: 15,
    // top: 2,
  },
  paragraph: {
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
});
export default Text;
