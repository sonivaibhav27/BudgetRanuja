import {atom} from 'recoil';

export const currentMonthBudgetAtom = atom<number>({
  key: 'currentBudgetAtom',
  default: -1,
});

export const detailBudgetAtom = atom<number>({
  key: 'BudgetAtom',
  default: -1,
});
