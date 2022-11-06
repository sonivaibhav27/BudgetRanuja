import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';

type OverlayProps = {
  children: JSX.Element;
};
export default (props: OverlayProps) => {
  return <View style={styles.overlay}>{props.children}</View>;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
});
