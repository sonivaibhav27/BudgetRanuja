import {atom} from 'recoil';

export const currentMonthBudget = atom<number>({
  key: 'currentBudgetAtom',
  default: -1,
});
