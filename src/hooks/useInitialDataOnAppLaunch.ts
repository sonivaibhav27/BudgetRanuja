import React from 'react';
import {useSetRecoilState} from 'recoil';
import OneSignal from 'react-native-onesignal';
import {CommonOperations, CurrencyOperations} from '../database';
import {BillsAtom, BudgetAtom, CategoriesAtom, UtilsAtom} from '../State/Atoms';
import {DayJs} from '../utils';
import {Keys} from '../config';

export default () => {
  const [loading, setLoading] = React.useState(true);
  const setCurrentMonthBudgetInRecoil = useSetRecoilState(
    BudgetAtom.currentMonthBudget,
  );
  const setCurrentMonthAllBillsInRecoil = useSetRecoilState(
    BillsAtom.CurrentMonthAllBills,
  );
  const setCurrencyInRecoil = useSetRecoilState(UtilsAtom.Currency);
  const setCategoriesInRecoil = useSetRecoilState(CategoriesAtom.AllCategories);

  const getDataFromDatabase = async () => {
    try {
      const monthAndYear = DayJs.getCurrentYearAndMonth();
      const result = await CommonOperations.GetBillsCategoryBudget(
        monthAndYear,
        true,
      );
      if (result) {
        setCurrentMonthAllBillsInRecoil(result.DBBills);
        setCurrentMonthBudgetInRecoil(result.DBBudget);
        if (result.DBCategories) {
          setCategoriesInRecoil(result.DBCategories);
        }
        const currency = await CurrencyOperations.getCurrency();
        setCurrencyInRecoil(currency?.symbol || '$');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      //show user popup for again load the database.
    }
  };

  const init = () => {
    getDataFromDatabase();
  };
  React.useEffect(() => {
    init();
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(Keys.ONESIGNAL_KEY);
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return loading;
};
