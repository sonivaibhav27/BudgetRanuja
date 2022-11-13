import React from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {DbUtils} from '../../database';
import {BillTypes} from '../../types';
import {DateHelper} from '../helper';
import {BillState, CategoryState} from '../state';
import Utils from '../utils';

export default (
  typeOfScreen: 'Create' | 'Edit',
  billData?: BillTypes.TEditBill,
) => {
  const initialData = billData;
  const isValidRouteParams = Utils.isValidObject(initialData);

  const categoryFromRecoil = useRecoilValue(CategoryState.allCategoryAtom);
  const setCurrentMonthAllBills = useSetRecoilState(
    BillState.currentMonthAllBillsAtom,
  );
  const [selectedBillType, setSelectedType] = React.useState<
    'expense' | 'income'
  >('expense');
  const [categoriesToShow, setCategoriesToShow] = React.useState(
    typeOfScreen === 'Create'
      ? DbUtils.getActiveCategoriesByCategoryType(
          selectedBillType,
          categoryFromRecoil,
        )!
      : DbUtils.getAllCategoriesByCategoryType(
          initialData!.billType!,
          categoryFromRecoil,
        ),
  );

  const [screenData, setScreenData] = React.useState({
    amount: isValidRouteParams ? initialData!.billAmount!.toString() : '',
    date: isValidRouteParams
      ? DateHelper.dayjsDate(initialData?.billDate!)
      : DateHelper.todayDate(),
    category: isValidRouteParams
      ? categoriesToShow.find(a => a.CategoryId === initialData!.categoryId)!
      : categoriesToShow[0],
    remark: isValidRouteParams ? initialData!.billRemark! : '',
  });

  return {
    screenData,
    setScreenData,
    setCategoriesToShow,
    setSelectedType,
    selectedBillType,
    setCurrentMonthAllBills,
    categoryFromRecoil,
    categoriesToShow,
  };
};
