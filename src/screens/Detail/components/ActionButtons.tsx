import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useRecoilState} from 'recoil';
import {DetailState} from '../../../State/Atoms';

export default () => {
  const [selected, setSelected] = useRecoilState(DetailState.selectedType);

  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={{top: 5, bottom: 5}}
        onPress={() => {
          if (selected !== 'expense') {
            setSelected('expense');
          }
        }}>
        <Text
          style={[styles.textStyle, selected === 'expense' && styles.selected]}>
          Expense
        </Text>
      </Pressable>
      <Pressable
        hitSlop={{top: 5, bottom: 5}}
        onPress={() => {
          if (selected !== 'income') {
            setSelected('income');
          }
        }}
        style={styles.incomeContainer}>
        <Text
          style={[styles.textStyle, selected === 'income' && styles.selected]}>
          Income
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  incomeContainer: {
    marginLeft: 15,
  },
  textStyle: {
    fontSize: 18,
    color: '#000',
  },
  selected: {
    backgroundColor: 'rgb(89,93,229)',
    padding: 7,
    borderRadius: 8,
    color: '#fff',
    fontWeight: '600',
  },
});
