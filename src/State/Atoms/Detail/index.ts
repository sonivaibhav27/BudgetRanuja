import Database from '@nozbe/watermelondb/Database';
import {atom, selector} from 'recoil';
import {ModelTypes} from '../../../database';
import {GroupByCategories} from '../../../utils';

interface Data {
  category: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
}

const Data: Data[] = [
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
    type: 'income',
  },
  {
    category: 'Education',
    amount: 10000,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 700,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Groceries',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
    type: 'income',
  },
  {
    category: 'Education',
    amount: 10000,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 700,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Groceries',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
    type: 'income',
  },
  {
    category: 'Education',
    amount: 10000,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 700,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Groceries',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
    type: 'income',
  },
  {
    category: 'Education',
    amount: 10000,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 700,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Groceries',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
    type: 'income',
  },
  {
    category: 'Education',
    amount: 10000,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 700,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Groceries',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 123,
    date: new Date(),
    type: 'income',
  },
];
export const selectedType = atom({
  key: 'selectedType',
  default: 'expense',
});

// export const DataAtom = atom({
//   key: 'DataAtom',
//   default: Data,
// });

export const ExpensesAtom = atom({
  key: 'ExpensesAtom',
  default: [] as ModelTypes.BillTypes[],
});

export const IncomeAtom = atom({
  key: 'IncomeAtom',
  default: [] as ModelTypes.BillTypes[],
});

export const incomeAndExpenseTotalForAMonthAtom = selector({
  key: 'incomeAmountSelector',
  get: ({get}) => {
    const expenses = get(ExpensesAtom);
    const incomes = get(IncomeAtom);
    const totalIncome = incomes.reduce((prev, current) => {
      return prev + current.billAmount!;
    }, 0);
    const totalExpense = expenses.reduce((prev, current) => {
      return prev + current.billAmount!;
    }, 0);
    return {
      totalIncome,
      totalExpense,
    };
  },
});

export const dataForDetail = selector({
  key: 'dataSelector',
  get: ({get}) => {
    const getSelectedType = get(selectedType);
    if (getSelectedType === 'expense') {
      const filtered = get(ExpensesAtom);
      return GroupByCategories(filtered);
    } else {
      const incomeFiltered = get(IncomeAtom);
      return GroupByCategories(incomeFiltered);
    }
  },
});

export const DatabaseAtom = atom<Database | null>({
  key: 'databaseAtom',
  default: null,
});
