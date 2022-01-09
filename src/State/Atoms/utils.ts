import {atom} from 'recoil';
import {Theme} from '../../theme&styles';
export const ThemeAtom = atom({
  key: 'theme',
  default: Theme.ColorsTheme,
});

export const Currency = atom({
  key: 'currencyAtom',
  default: '$',
});

export const PremiumUser = atom({
  key: 'premiumUserAtom',
  default: false,
});
