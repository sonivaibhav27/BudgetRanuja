import React from 'react';
import {StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {ViewText} from '../../../../components';
import {BillState, BudgetState} from '../../../../state';
import {COLORS} from '../../../../theme';
export default () => {
  const expenses = useRecoilValue(BillState.currentMonthExpenseBillsAtom);
  const budget = useRecoilValue(BudgetState.currentMonthBudgetAtom);
  const expenseTotal = expenses.reduce(
    (prev, curr) => prev + curr.billAmount,
    0,
  );
  if (budget !== -1 && expenseTotal > budget) {
    return (
      <ViewText
        viewStyle={styles.container}
        textStyle={styles.text}
        text={'You are over budget'}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.red,
    padding: 5,
  },
  text: {
    color: COLORS.lightGray,
    textAlign: 'center',
    fontWeight: '700',
  },
});
