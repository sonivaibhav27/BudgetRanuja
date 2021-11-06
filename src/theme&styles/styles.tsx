import {StyleSheet} from 'react-native';

//@flow
export const Font = {
  Bold: 'OpenSans-Bold',
  Regular: 'OpenSans-Regular',
  SemiBold: 'OpenSans-SemiBold',
  Light: 'OpenSans-Light',
};

export const TextStyle = {
  h1: {
    fontFamily: Font.Bold,
    fontSize: 25,
  },
  header: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: '#000',
  },
  text: {
    fontFamily: Font.SemiBold,
  },
};

export const GlobalCommonStyles = StyleSheet.create({
  textStyle: {
    color: '#000',
    ...TextStyle.text,
  },
});
