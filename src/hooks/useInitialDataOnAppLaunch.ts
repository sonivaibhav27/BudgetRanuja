import React from 'react';
import {useRecoilCallback, useSetRecoilState} from 'recoil';
import {useInitializeExpenseCategories} from '.';
import {WatermenlonDB} from '../..';
import {BillOperations, BudgetOperations} from '../database';
import {BudgetAtom, DetailState} from '../State/Atoms';
import Dayjs from '../utils/dayjs';

export default () => {
  const [loading, setLoading] = React.useState(true);
  useInitializeExpenseCategories();
  const setCurrentMonthAndYearInAtom = useSetRecoilState(
    BudgetAtom.currentMonthBudget,
  );
  const setRecoilData = useRecoilCallback(
    ({set}) =>
      (data: any) => {
        set(DetailState.ExpensesAtom, [
          ...data.filter(bill => bill.billType! === 2),
        ]);
        set(DetailState.IncomeAtom, [
          ...data.filter(bill => bill.billType! === 1),
        ]);
      },
    [],
  );
  const getUserBills = React.useCallback(async () => {
    try {
      const record = await BillOperations.getCurrentMonthBills();
      // await BillOperations.resetDatabase();
      await BillOperations.getBillsByCategories('Education');
      if (record) {
        setRecoilData(record);
      }
      setLoading(false);
    } catch (err) {}
  }, [setRecoilData]);

  const getCategories = async () => {
    const getLocalCategories = await WatermenlonDB.adapter.getLocal(
      '_categories',
    );
    if (getLocalCategories === null) {
      //  set
    } else {
    }
  };

  const getBudget = async () => {
    const monthAndYear = Dayjs.getCurrentMonthAndYear();
    const currentBudget = await BudgetOperations.getCurrentMonthBudget(
      monthAndYear,
    );
    if (currentBudget) {
      setCurrentMonthAndYearInAtom(currentBudget);
    } else {
      setCurrentMonthAndYearInAtom(-1);
    }
  };

  React.useEffect(() => {
    getUserBills();
    getCategories();
    getBudget();
  }, [getUserBills]);

  return loading;
};
