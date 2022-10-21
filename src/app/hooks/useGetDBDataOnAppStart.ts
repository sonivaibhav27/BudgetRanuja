import React from 'react';
import {I18nManager} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {CommonOperations, CurrencyOperations} from '../../database';
import {UtilState, CategoryState, BillState, BudgetState} from '../state';
import {DateHelper, PaymentManager} from '../helper';

export default () => {
  const [loading, setLoading] = React.useState(true);
  const setCurrentMonthBudgetInRecoil = useSetRecoilState(
    BudgetState.currentMonthBudgetAtom,
  );
  const setCurrentMonthAllBillsInRecoil = useSetRecoilState(
    BillState.currentMonthAllBillsAtom,
  );
  const setCurrencyInRecoil = useSetRecoilState(UtilState.currencyUtilAtom);
  const setCategoriesInRecoil = useSetRecoilState(
    CategoryState.allCategoryAtom,
  );
  const setPremiumStatusOfUser = useSetRecoilState(UtilState.premiumUtilAtom);

  const getDataFromDatabase = async () => {
    try {
      const monthAndYear = DateHelper.getCurrentYearAndMonth();
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

  const getPreimumStatusOfUser = async () => {
    try {
      const isPremium = await PaymentManager.getActivePermission();
      if (isPremium) {
        if (__DEV__) {
          setPremiumStatusOfUser(false);
        } else {
          setPremiumStatusOfUser(false);
        }
      }
    } catch (err) {}
  };
  const init = async () => {
    getPreimumStatusOfUser();
    getDataFromDatabase();
  };
  React.useEffect(() => {
    I18nManager.forceRTL(false);
    init();
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);
  return loading;
};
