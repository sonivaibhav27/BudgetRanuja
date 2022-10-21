import {atom} from 'recoil';
import {CategoriesTypes} from '../../types';

export const allCategoryAtom = atom<CategoriesTypes.TCategories[]>({
  key: 'allCategories',
  default: [],
});

export const categoryDictionaryCategoryAtom = atom<boolean>({
  key: 'dictionaryCategory',
  default: false,
});
