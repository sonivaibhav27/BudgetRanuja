import React from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {UtilTypes} from '../../../types';
import {COLORS} from '../../theme';
import Text from './Text';
interface Props {
  headerTitle: string;
  textAlign: 'center' | 'left';
  headerRight?: JSX.Element;
  style?: ViewStyle;
  textType?: UtilTypes.TTextType;
  textStyle?: TextStyle;
}

const Header = (props: Props) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={props.textStyle} textType={props.textType!}>
        {props.headerTitle}
      </Text>
      {typeof props.headerRight !== 'undefined' && props.headerRight}
    </View>
  );
};

Header.defaultProps = {
  headerTitle: '',
  textType: 'heading',
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    // elevation: 1,
    backgroundColor: COLORS.white,
    // marginBottom: 10,
    zIndex: -1,
  },
});
export default Header;
