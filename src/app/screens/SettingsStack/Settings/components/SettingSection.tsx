import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../components';
import {COLORS} from '../../../../theme';

type Props = {
  title: string;
  children?: ReactElement;
};

export default (props: Props) => {
  return (
    <View style={styles.container}>
      <Text textType="subheading" style={styles.title}>
        {props.title}
      </Text>
      <View style={styles.childrenContainer}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    color: COLORS.secondry,
    fontWeight: 'bold',
    fontSize: 12.6,
    textTransform: 'uppercase',
  },
  childrenContainer: {
    paddingVertical: 10,
  },
});
