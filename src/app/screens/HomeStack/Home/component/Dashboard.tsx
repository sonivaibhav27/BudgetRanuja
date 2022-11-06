import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Text} from '../../../../components';
import {BillState, BudgetState} from '../../../../state';
import {BORDER_RADIUS, COLORS} from '../../../../theme';
import Utils from '../../../../utils';

const {width} = Dimensions.get('window');

type SectionProps = {
  type: string;
  amount: string;
  currency: string;
};
const Section = (props: SectionProps) => {
  return (
    <View style={styles.row}>
      <Text textType="normal" style={styles.type}>
        {props.type}
      </Text>
      <View style={styles.currencyContainer}>
        <Text style={styles.currency} textType="subheading">
          {props.currency}
        </Text>
        <Text textType="subheading" style={styles.value}>
          {props.amount}
        </Text>
      </View>
    </View>
  );
};

type Props = {
  currency: string;
};

export default (props: Props) => {
  const currentMonthBills = useRecoilValue(BillState.currentMonthAllBillsAtom);
  const currentMonthBudget = useRecoilValue(BudgetState.currentMonthBudgetAtom);
  const currentMonthExpenses = Utils.getTotalAmount(
    currentMonthBills.filter(i => i.typeOfBill === 'expense') as any,
  );
  const currentMonthIncome = Utils.getTotalAmount(
    currentMonthBills.filter(i => i.typeOfBill === 'income') as any,
  );
  const balance =
    currentMonthBudget !== -1
      ? currentMonthBudget - currentMonthExpenses
      : null;
  return (
    <View style={styles.container}>
      <Text textType="subheading" style={styles.myDashboard}>
        My Monthly Dashboard
      </Text>
      <View style={styles.valueContainer}>
        <Section
          currency={props.currency}
          type="Expense"
          amount={`${Utils.formatIntoCurrency(currentMonthExpenses || 0)}`}
        />
        <Section
          currency={props.currency}
          type="Income"
          amount={`${Utils.formatIntoCurrency(currentMonthIncome || 0)}`}
        />
        {balance !== null && (
          <Section
            currency={props.currency}
            type="Balance"
            amount={`${Utils.formatIntoCurrency(balance)}`}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.medium,
    maxWidth: 400,
    width: width * 0.9,
    alignSelf: 'center',
    borderColor: COLORS.primary,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  type: {
    color: COLORS.darkGray,
    fontSize: 15,
  },
  value: {
    color: COLORS.black,
    fontSize: 16.5,
  },
  myDashboard: {
    fontSize: 15,
    color: COLORS.darkGray,
    marginBottom: 20,
    textAlign: 'center',
  },
  valueContainer: {
    marginHorizontal: 25,
  },
  currency: {
    fontSize: 10,
    color: COLORS.secondry,
    marginRight: 2,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
