import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {BudgetAtom, DetailState} from '../../../State/Atoms';
import {Miscellaneous} from '../../../utils';

interface AuditProps {
  text: string;
  amount: string;
}
const Audit = ({text, amount}: AuditProps) => {
  return (
    <View style={styles.auditContainer}>
      <Text style={styles.auditHeaderText}>{text}</Text>
      <Text style={styles.auditAmountText}>{amount}</Text>
    </View>
  );
};

const Separator = () => {
  return <View style={styles.separator} />;
};

export default () => {
  const auditAmount = useRecoilValue(DetailState.DetailAuditBanner);
  const auditBudget = useRecoilValue(BudgetAtom.DetailBudgetAtom);
  return (
    <View style={styles.container}>
      <Audit
        text="budget"
        amount={
          auditBudget === -1
            ? 'Not Set'
            : Miscellaneous.formatIntoCurrency(auditBudget)
        }
      />
      <Separator />
      <Audit
        text="income"
        amount={Miscellaneous.formatIntoCurrency(auditAmount.incomeTotal)}
      />
      <Separator />
      <Audit
        text="expense"
        amount={Miscellaneous.formatIntoCurrency(auditAmount.expenseTotal)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'rgb(89,93,229)',
    backgroundColor: '#f1f1f1',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
  },
  auditContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  auditHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    textTransform: 'capitalize',
  },
  auditAmountText: {
    fontWeight: 'bold',
    color: '#A35E00',
    fontSize: 15,
  },
  separator: {
    borderLeftWidth: 2,
    borderColor: '#000',
    height: 30,
    alignSelf: 'center',
  },
});
