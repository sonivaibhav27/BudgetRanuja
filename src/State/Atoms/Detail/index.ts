import {atom, selector} from 'recoil';
import {CategoriesAtom} from '..';
import {OnlyInformationFromBillType} from '../../../types';
import {GroupByCategories} from '../../../utils';

type TDetailDataType = [
  {billCategory: string; billAmount: number; categoryColor: string}[],
  'expense' | 'income',
];

export const selectedType = atom({
  key: 'selectedType',
  default: 'expense',
});

export const DetailAllBills = atom<OnlyInformationFromBillType[] | []>({
  key: 'DetailAllBills',
  default: [],
});

export const DetailDataBasedOnSelectedType = selector<TDetailDataType>({
  key: 'DetailDataBasedOnSelectedType',
  get: ({get}) => {
    const allBills = get(DetailAllBills);
    const selectType = get(selectedType);
    get(CategoriesAtom.DictionaryOfCategories);
    if (selectType === 'expense') {
      return [
        GroupByCategories(
          allBills.filter(bill => bill.typeOfBill! === 'expense'),
        ),
        'expense',
      ];
    } else {
      return [
        GroupByCategories(
          allBills.filter(bill => bill.typeOfBill! === 'income'),
        ),
        'income',
      ];
    }
  },
});

export const DetailAuditBanner = selector({
  key: 'DetailAuditBanner',
  get: ({get}) => {
    const allBills = get(DetailAllBills);
    const expenseTotal = allBills
      .filter(bill => bill.typeOfBill === 'expense')
      .reduce((prev, curr) => {
        return prev + curr.billAmount;
      }, 0);
    const incomeTotal = allBills
      .filter(bill => bill.typeOfBill === 'income')
      .reduce((prev, curr) => {
        return prev + curr.billAmount;
      }, 0);

    return {
      expenseTotal,
      incomeTotal,
    };
  },
});
