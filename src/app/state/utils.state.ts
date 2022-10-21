import {atom} from 'recoil';

export const currencyUtilAtom = atom({
  key: 'currencyAtom',
  default: '$',
});

export const premiumUtilAtom = atom({
  key: 'premiumUserAtom',
  default: false,
});

export const userConsentUtilAtom = atom<0 | 1 | 2>({
  key: 'userConsent',
  default: 0,
});

export const selectedAccordianInDetailUtilAtom = atom<'expense' | 'income'>({
  key: 'selectedType',
  default: 'expense',
});
