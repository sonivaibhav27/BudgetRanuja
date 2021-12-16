import {atom} from 'recoil';
import {TCategoryType} from '../../../types';

export const AllCategories = atom<TCategoryType[]>({
  key: 'allCategories',
  default: [],
});

export const DictionaryOfCategories = atom<boolean>({
  key: 'dictionaryCategory',
  default: false,
});
