import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {BudgetAtom} from '../../../State/Atoms';
import {Miscellaneous} from '../../../utils';

type Props = {
  sumOfExpenses: number;
};

export default (props: Props) => {
  const budget = useRecoilValue(BudgetAtom.currentMonthBudget);

  if (budget !== -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.balanceText}>Balance</Text>
        <Text style={styles.balanceAmount}>
          {/* <Text style={styles.currency}>{currency} </Text> */}
          {Miscellaneous.formatIntoCurrency(budget - props.sumOfExpenses)}
        </Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    top: -40,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  balanceAmount: {fontWeight: '800', color: '#000'},
  balanceText: {
    color: '#555',
    fontWeight: '700',
  },
  currency: {
    fontSize: 12,
    color: '#000',
    fontWeight: '900',
  },
});
