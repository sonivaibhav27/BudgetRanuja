import {TEditBills, TCategoryType} from '../../types';

export type MainStackScreenType = {
  Home: undefined;
  Detail: undefined;
  Create: {
    comingFrom: 'expense' | 'income';
    screenType: 'Create' | 'Edit';
    categoryData?: TEditBills;
  };
  Settings: undefined;
  DetailAboutOneCategory: {
    categoryName: string;
    monthAndYearOfBillToShow: number;
    billType: 'income' | 'expense';
    currency: string;
  };
  Pricing: {version: string};
  PieChart: undefined;
  EditCategory: {
    categoryId?: string;
    categoryName?: string;
    categoryType?: 'income' | 'expense';
    allCategories?: TCategoryType[];
    comingFrom: 'Category' | 'Currency';
  };
};
