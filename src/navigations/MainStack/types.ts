export type MainStackScreenType = {
  Home: undefined;
  Detail: undefined;
  Create: {comingFrom: 'expense' | 'income'};
  Settings: undefined;
  DetailAboutOneCategory: {categoryName: string};
};
