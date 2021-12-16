import {atom} from 'recoil';

export const currentMonthBudget = atom<number>({
  key: 'currentBudgetAtom',
  default: -1,
});

export const DetailBudgetAtom = atom<number>({
  key: 'BudgetAtom',
  default: -1,
});
