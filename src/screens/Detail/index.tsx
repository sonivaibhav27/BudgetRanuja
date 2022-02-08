import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  I18nManager,
  Pressable,
} from 'react-native';

import MonthPicker, {ACTION_DATE_SET} from 'react-native-month-year-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilCallback, useSetRecoilState} from 'recoil';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {AuditSection, ActionButtons, DataSection} from './components';
import {DayJs, Icons, Toast} from '../../utils';
import {BillOperations, BudgetOperations} from '../../database';
import {BillsAtom, BudgetAtom, DetailState} from '../../State/Atoms';
import {ActivityLoader} from '../../common';
import UseInterstitialAd from '../../hooks/Ads/UseInterestitial';

type Props = {
  navigation: StackNavigationProp<MainStackScreenType, 'Detail'>;
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const formateDateToGetMonthAndYear = (date: Date) => {
  return `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
};
export default (_: Props) => {
  const {height} = useWindowDimensions();

  const [
    interstitialAdDismissed,
    interstitialLoadAd,
    intersitialShowAd,
    DismissedInterestialAdCallback,
  ] = UseInterstitialAd();
  const [loadingAd, setLoadingAd] = React.useState(false);
  const [dateToShowBillsFor, setDateToShowBillsFor] = React.useState(
    new Date(),
  );
  const [monthPickerVisible, setMonthPickerVisible] = React.useState(false);
  const toggleMonthPicker = () => {
    setMonthPickerVisible(!monthPickerVisible);
  };

  const setDetailAllBills = useSetRecoilState(DetailState.DetailAllBills);
  const setDetailBudget = useSetRecoilState(BudgetAtom.DetailBudgetAtom);

  //const rewarded = React.useRef<GoogleAdsTypes.RewardedAd>();
  const currentCard = React.useRef<{
    categoryName: string;
    monthAndYearOfBillToShow: number;
    billType: string;
    currency: string;
  } | null>(null);

  const init = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const detailBills = snapshot.getLoadable(
          BillsAtom.CurrentMonthAllBills,
        ).contents;
        const detailBudget = snapshot.getLoadable(
          BudgetAtom.currentMonthBudget,
        ).contents;
        setDetailBudget(detailBudget);
        setDetailAllBills(detailBills);
      },
    [],
  );

  const _loadAd = () => {
    setLoadingAd(true);
    const isLoaded = intersitialShowAd();
    if (!isLoaded) {
      setLoadingAd(false);
      _.navigation.navigate('DetailAboutOneCategory', {
        categoryName: currentCard.current?.categoryName!,
        billType: currentCard.current?.billType! as 'income' | 'expense',
        currency: currentCard.current?.currency!,
        monthAndYearOfBillToShow:
          currentCard.current?.monthAndYearOfBillToShow!,
      });
    }
  };

  React.useEffect(() => {
    if (interstitialAdDismissed) {
      interstitialLoadAd();
      DismissedInterestialAdCallback();
      setLoadingAd(false);
      if (currentCard.current === null) {
        Toast('Something went wrong. Please reload the app.');
        return;
      }
      _.navigation.navigate('DetailAboutOneCategory', {
        categoryName: currentCard.current?.categoryName!,
        billType: currentCard.current?.billType! as 'income' | 'expense',
        currency: currentCard.current?.currency!,
        monthAndYearOfBillToShow:
          currentCard.current?.monthAndYearOfBillToShow!,
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interstitialAdDismissed]);

  React.useEffect(() => {
    init();
  }, [init]);

  const callMonthPickerFunction = async (event: string, newDate: Date) => {
    console.log({newDate});
    switch (event) {
      case ACTION_DATE_SET:
        toggleMonthPicker();
        setDateToShowBillsFor(newDate);
        const yearAndMonth = DayJs.getYearAndMonthFromDate(newDate);
        console.log({yearAndMonth});
        const bills = await BillOperations.getCurrentMonthBills(yearAndMonth);
        const budget = await BudgetOperations.getCurrentMonthBudget(
          yearAndMonth,
        );
        setDetailAllBills(bills != null ? bills : []);
        setDetailBudget(budget || -1);
        break;
      default:
        toggleMonthPicker();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.currentMonthContainer}
        onPress={toggleMonthPicker}>
        <Text style={styles.currentMonthText}>
          {formateDateToGetMonthAndYear(dateToShowBillsFor)}
        </Text>
        <View style={styles.dateIconContainer}>
          <Icons.Fontisto size={20} name="date" color={'#000'} />
        </View>
      </Pressable>
      <View>
        <ActionButtons />
      </View>
      <View style={styles.dataContainer}>
        <DataSection
          selectedCardForAd={currentCard}
          loadAd={_loadAd}
          monthAndYearOfBillToShow={DayJs.getYearAndMonthFromDate(
            dateToShowBillsFor,
          )}
        />
      </View>
      <View style={{height: height * 0.12}}>
        <AuditSection />
      </View>
      {/* <MonthYearPicker /> */}
      {monthPickerVisible && (
        <MonthPicker
          locale="en"
          onChange={callMonthPickerFunction}
          value={dateToShowBillsFor}
        />
      )}

      {loadingAd && (
        <View style={styles.overlayCenter}>
          <ActivityLoader loadingText="loading ad..." />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  dataContainer: {flex: 1},
  saveToDriveContainer: {
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(89,93,229,0.1)',
    padding: 8,
    borderRadius: 100,
  },
  saveToDriveText: {
    color: '#000',
    paddingLeft: I18nManager.isRTL ? 0 : 4,
    paddingRight: I18nManager.isRTL ? 4 : 0,
  },
  currentMonthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 5,
    // borderColor: '#ddd',
    marginHorizontal: 10,
    backgroundColor: 'rgba(163,94,0,0.07)',
  },
  currentMonthText: {
    fontSize: 17,
    padding: 8,
    color: '#000',
    fontWeight: '700',
  },

  overlayCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dateIconContainer: {
    // padding: 9,
    // backgroundColor: 'rgba(89,93,229,0.1)',
    // borderRadius: 100,
  },
});
