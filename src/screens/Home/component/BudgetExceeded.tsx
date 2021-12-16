import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {BillsAtom, BudgetAtom} from '../../../State/Atoms';
import {Theme} from '../../../theme&styles';

export default () => {
  const expenses = useRecoilValue(BillsAtom.CurrentMonthExpenseBills);
  const budget = useRecoilValue(BudgetAtom.currentMonthBudget);
  const expenseTotal = expenses.reduce(
    (prev, curr) => prev + curr.billAmount,
    0,
  );
  if (budget !== -1 && expenseTotal > budget) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are over budget.</Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.ColorsTheme.expense.borderColor,
    padding: 5,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});
