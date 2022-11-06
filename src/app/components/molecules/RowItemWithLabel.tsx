import React, {ReactElement} from 'react';
import {View, StyleSheet, ViewStyle, Dimensions} from 'react-native';
import {COLORS, PADDING} from '../../../app/theme';
import {Text} from '../atoms';
interface Props {
  text: string;
  children: ReactElement;
  childrenStyle?: ViewStyle;
}

const {width} = Dimensions.get('window');
const RowItemWithLabel = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text textType="normal" style={styles.textStyle}>
        {props.text}
      </Text>
      <View style={[styles.valueContainer, props.childrenStyle]}>
        {props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: PADDING.medium,
    width: width * 0.9,
    alignSelf: 'center',
  },
  valueContainer: {
    padding: PADDING.mediumBig,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  textStyle: {
    color: COLORS.darkGray,
    fontWeight: '600',
    marginRight: 15,
    fontSize: 12,
    marginBottom: 6,
  },
});
export default RowItemWithLabel;
