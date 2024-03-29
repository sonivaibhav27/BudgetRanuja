import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {Pressable, Text} from '../atoms';

type Props = {
  text: 'income' | 'expense';
  selected: boolean;
  onPress: (type: 'income' | 'expense') => void;
};

export default ({text, selected, onPress}: Props) => {
  return (
    <Pressable onPress={() => onPress(text)} style={styles.container}>
      <View style={styles.circle}>
        {selected && <View style={styles.selected} />}
      </View>
      <Text textType="normal" style={styles.text}>
        {text}
      </Text>
    </Pressable>
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
    backgroundColor: COLORS.primary,
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
