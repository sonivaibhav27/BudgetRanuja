import {atom, selector} from 'recoil';
import {UtilTypes} from '../../types';
import {categoryDictionaryCategoryAtom} from './category.state';
import {selectedAccordianInDetailUtilAtom} from './utils.state';
import {DbUtils} from '../../database';
type TBillsBasedOnMonthSelected = [
  {billCategory: string; billAmount: number; categoryColor: string}[],
  'expense' | 'income',
];

/**
 * @description Atom for storing current month bills/
 */
export const currentMonthAllBillsAtom = atom<
  UtilTypes.TOnlyInformationFromBill[]
>({
  key: 'CurrentMonthAllBills',
  default: [],
});

/**
 * @description Atom for storing expense month bills/
 */
export const currentMonthExpenseBillsAtom = selector({
  key: 'CurrentMonthExpenseBills',
  get: ({get}) => {
    const currentMonthBills = get(currentMonthAllBillsAtom);
    return currentMonthBills.filter(bill => bill.typeOfBill === 'expense');
  },
});

/**
 * @description Atom for storing income month bills/
 */
export const currentMonthIncomeBillsAtom = selector({
  key: 'CurrentMonthIncomeBills',
  get: ({get}) => {
    const currentMonthBills = get(currentMonthAllBillsAtom);
    return currentMonthBills.filter(bill => bill.typeOfBill === 'income');
  },
});

/**
 * @description Holds billsData for the month selected.
 */
export const basedOnMonthSelectedAllBillsAtom = atom<
  UtilTypes.TOnlyInformationFromBill[] | []
>({
  key: 'DetailAllBills',
  default: [],
});

export const groupedBasedOnCategoryByMonthSelectedBillsAtom =
  selector<TBillsBasedOnMonthSelected>({
    key: 'DetailDataBasedOnSelectedType',
    get: ({get}) => {
      const allBills = get(basedOnMonthSelectedAllBillsAtom);
      const selectType = get(selectedAccordianInDetailUtilAtom);
      //for renaming category so have to create a useless atom.
      get(categoryDictionaryCategoryAtom);
      if (selectType === 'expense') {
        return [
          DbUtils.groupBillsByCategory(
            allBills.filter(bill => bill.typeOfBill! === 'expense'),
          ),
          'expense',
        ];
      } else {
        return [
          DbUtils.groupBillsByCategory(
            allBills.filter(bill => bill.typeOfBill! === 'income'),
          ),
          'income',
        ];
      }
    },
  });
