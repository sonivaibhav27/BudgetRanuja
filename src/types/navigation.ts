import {TEditBill} from './bill';
import {TCategories} from './category';

export type TRootStackScreens = {
  BottomTabBarScreen: undefined;
  CreateEditScreen: {
    categoryData?: TEditBill;
    isCreateScreen: boolean;
  };
};
export type TBottomTabScreens = {
  HomeStack: undefined;
  SettingStack: undefined;
  ChartStack: undefined;
  DetailStack: undefined;
};

export type TDetailStackScreen = {
  Detail: undefined;
  DetailAboutOneCategory: {
    categoryName: string;
    monthAndYearOfBillToShow: number;
    billType: 'income' | 'expense';
    currency: string;
  };
  Report: undefined;
};

export type THomeStackScreen = {
  Home: undefined;
};

export type TSettingStackScreen = {
  Settings: undefined;
  Edit: {
    category?: {
      categoryName: string;
      categoryType: 'income' | 'expense';
      categoryId: string;
      categoryColor: string;
    };
    categories?: TCategories[];
    comingFrom: 'Category' | 'Currency';
    type?: 'New';
  };
};
