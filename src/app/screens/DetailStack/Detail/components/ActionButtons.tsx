import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useRecoilState} from 'recoil';
import {PressableTextButton} from '../../../../components';
import {UtilState} from '../../../../state';
import {COLORS} from '../../../../theme';

export default () => {
  const [selected, setSelected] = useRecoilState(
    UtilState.selectedAccordianInDetailUtilAtom,
  );

  return (
    <View style={styles.container}>
      <PressableTextButton
        onPress={() => {
          if (selected !== 'expense') {
            setSelected('expense');
          }
        }}
        textType="subheading"
        text="Expense"
        textStyle={selected === 'expense' ? styles.selected : styles.textStyle}
      />
      <PressableTextButton
        style={styles.incomeContainer}
        onPress={() => {
          if (selected !== 'income') {
            setSelected('income');
          }
        }}
        textType="subheading"
        text="Income"
        textStyle={selected === 'income' ? styles.selected : styles.textStyle}
      />
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
    fontSize: 16,
    color: COLORS.mediumGray,
    padding: 10,
  },
  selected: {
    borderColor: COLORS.black,
    padding: 10,
    color: COLORS.black,
    textAlign: 'center',
    borderRadius: 2,
    fontSize: 16,
    borderBottomWidth: 2,
  },
});
