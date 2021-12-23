import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {PressableButton} from '../../../common';
import {Theme} from '../../../theme&styles';

type Props = {
  text: 'income' | 'expense';
  selected: boolean;
  onPress: (type: 'income' | 'expense') => void;
};

export default ({text, selected, onPress}: Props) => {
  return (
    <PressableButton
      hitSlop={{
        top: 5,
        left: 5,
        right: 5,
      }}
      onPress={() => onPress(text)}
      style={styles.container}>
      <View style={styles.circle}>
        {selected && <View style={styles.selected} />}
      </View>
      <Text style={styles.text}>{text}</Text>
    </PressableButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: Theme.ColorsTheme.primary,
    height: 10,
    width: 10,
    borderRadius: 12,
  },
  text: {
    color: '#000',
    marginLeft: 5,
    textTransform: 'capitalize',
    fontSize: 16,
  },
});
