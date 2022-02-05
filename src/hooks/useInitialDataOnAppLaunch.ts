import React from 'react';
import {I18nManager} from 'react-native';
import {useSetRecoilState} from 'recoil';
import OneSignal from 'react-native-onesignal';
import {CommonOperations, CurrencyOperations} from '../database';
import {BillsAtom, BudgetAtom, CategoriesAtom, UtilsAtom} from '../State/Atoms';
import {DayJs, QonversionManager} from '../utils';
import {Keys} from '../config';
import initializeAds from './Ads/initializeAds';
import useAdsConsentHook from './Ads/useAdConsent';

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
  const setPremiumStatusOfUser = useSetRecoilState(UtilsAtom.PremiumUser);

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

  const getPreimumStatusOfUser = async () => {
    try {
      const isPremium = await QonversionManager.getActivePermission();
      setPremiumStatusOfUser(isPremium);
    } catch (err) {}
  };
  const init = async () => {
    getPreimumStatusOfUser();
    getDataFromDatabase();
  };
  const isLoaded = useAdsConsentHook();
  React.useEffect(() => {
    // I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    init();
    initializeAds();
    if (!__DEV__) {
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId(Keys.ONESIGNAL_KEY);
    }
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);
  return (loading || !isLoaded) && (!loading || isLoaded);
};
