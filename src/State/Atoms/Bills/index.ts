import {atom, selector} from 'recoil';
import {OnlyInformationFromBillType} from '../../../types';

/**
 * @description Atom for storing current month bills/
 */
export const CurrentMonthAllBills = atom<OnlyInformationFromBillType[]>({
  key: 'CurrentMonthAllBills',
  default: [],
});

/**
 * @description Atom for storing expense month bills/
 */
export const CurrentMonthExpenseBills = selector({
  key: 'CurrentMonthExpenseBills',
  get: ({get}) => {
    const currentMonthBills = get(CurrentMonthAllBills);
    return currentMonthBills.filter(bill => bill.typeOfBill === 'expense');
  },
});

/**
 * @description Atom for storing income month bills/
 */
export const CurrentMonthIncomeBills = selector({
  key: 'CurrentMonthIncomeBills',
  get: ({get}) => {
    const currentMonthBills = get(CurrentMonthAllBills);
    return currentMonthBills.filter(bill => bill.typeOfBill === 'income');
  },
});

export const CurrentMonthAuditDetail = selector({
  key: 'CurrentMonthAuditDetail',
  get: ({get}) => {
    const getCurrentMonthExpenses = get(CurrentMonthExpenseBills);
    const getCurrentMonthIncome = get(CurrentMonthIncomeBills);
    return {
      expenseTotal: totalForBillType(getCurrentMonthExpenses),
      incomeTotal: totalForBillType(getCurrentMonthIncome),
    };
  },
});

function totalForBillType(bills: OnlyInformationFromBillType[]) {
  console.log({totalForBillType: bills});
  return bills.reduce(
    (prev: number, curr: OnlyInformationFromBillType) => prev + curr.billAmount,
    0,
  );
}
