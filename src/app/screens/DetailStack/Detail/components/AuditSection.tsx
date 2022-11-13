import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Text} from '../../../../components';
import {BillState, BudgetState} from '../../../../state';
import {COLORS} from '../../../../theme';
import Utils from '../../../../utils';

interface AuditProps {
  text: string;
  amount: string;
}
const Audit = ({text, amount}: AuditProps) => {
  return (
    <View style={styles.auditContainer}>
      <Text textType="paragraph" style={styles.auditHeaderText}>
        {text}
      </Text>
      <Text textType="heading" style={styles.auditAmountText}>
        {amount}
      </Text>
    </View>
  );
};

const Separator = () => {
  return <View style={styles.separator} />;
};

export default () => {
  const currentMonthBills = useRecoilValue(
    BillState.basedOnMonthSelectedAllBillsAtom,
  );
  const auditBudget = useRecoilValue(BudgetState.detailBudgetAtom);
  const expenseTotal = Utils.getTotalAmount(
    currentMonthBills.filter(i => i.typeOfBill === 'expense') as any,
  );
  const incomeTotal = Utils.getTotalAmount(
    currentMonthBills.filter(i => i.typeOfBill === 'income') as any,
  );
  return (
    <View style={styles.container}>
      <Audit
        text="budget"
        amount={
          auditBudget === -1 ? 'Not Set' : Utils.formatIntoCurrency(auditBudget)
        }
      />
      <Separator />
      <Audit text="income" amount={Utils.formatIntoCurrency(incomeTotal)} />
      <Separator />
      <Audit text="expense" amount={Utils.formatIntoCurrency(expenseTotal)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
    elevation: 1,
    borderTopWidth: 0.1,
  },
  auditContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  auditHeaderText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textTransform: 'capitalize',
  },
  auditAmountText: {
    color: COLORS.black,
    fontSize: 15,
  },
  separator: {
    borderLeftWidth: 2,
    borderColor: '#000',
    height: 30,
    alignSelf: 'center',
  },
});
