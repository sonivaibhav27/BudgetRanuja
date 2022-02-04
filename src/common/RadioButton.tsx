import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Theme} from '../theme&styles';

type Props = {
  isSelected: boolean;
  name: string;
};
const SIZE = 20;
const SELECTED_SIZE = 12;
export default ({isSelected, name}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        {isSelected && <View style={styles.selected} />}
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE,
    borderWidth: 0.4,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    height: SELECTED_SIZE,
    width: SELECTED_SIZE,
    borderRadius: SELECTED_SIZE * 2,
    backgroundColor: Theme.ColorsTheme.primary,
  },
  name: {
    marginLeft: 10,
    color: '#000',
    fontSize: 18,
  },
});
