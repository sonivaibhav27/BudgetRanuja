import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackScreenType} from '../navigations/MainStack/types';

export type FlatlistItemProp = {
  item: DataProp;
  index: number;
};
export type DataProp = {
  billAmount: number;
  billDate: Date;
  billRemark: string;
  categoryId: string;
  typeOfBill: 'expense' | 'income';
  id: string;
};

export type RenderFlatlistWithDataProps = {
  data: DataProp[];
  navigation: StackNavigationProp<
    MainStackScreenType,
    'DetailAboutOneCategory'
  >;
  currency: string;
};
