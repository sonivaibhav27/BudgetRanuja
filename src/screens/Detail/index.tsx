import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  I18nManager,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import MonthPicker, {ACTION_DATE_SET} from 'react-native-month-year-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilCallback, useSetRecoilState} from 'recoil';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {AuditSection, ActionButtons, DataSection} from './components';
import {buildCSV, DayJs, Icons, PopupMessage, Toast} from '../../utils';
import {BillOperations, BudgetOperations} from '../../database';
import {BillsAtom, BudgetAtom, DetailState} from '../../State/Atoms';
import {ActivityLoader} from '../../common';
import {loadRewardAd} from '../../hooks';
import {GoogleAdsTypes} from '@invertase/react-native-google-ads';

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
  const [loadAd, adEventHandler, rewardedInstance] = loadRewardAd();
  //const [loadAd, isWatchedAd] = loadRewardAd();
  const [generatingCsv, setGeneratingCsv] = React.useState(false);
  const [loadingAd, setLoadingAd] = React.useState(false);
  const [dateToShowBillsFor, setDateToShowBillsFor] = React.useState(
    new Date(),
  );
  const [monthPickerVisible, setMonthPickerVisible] = React.useState(false);
  const toggleMonthPicker = () => {
    setMonthPickerVisible(!monthPickerVisible);
  };
  const watchedAdRef = React.useRef<boolean>(false);
  const watchAdFromWhichSource = React.useRef<
    'Report' | 'Bill In Detail' | null
  >(null);

  const setDetailAllBills = useSetRecoilState(DetailState.DetailAllBills);
  const setDetailBudget = useSetRecoilState(BudgetAtom.DetailBudgetAtom);
  const currentCard = React.useRef<{
    categoryName: string;
    monthAndYearOfBillToShow: number;
    billType: string;
    currency: string;
  } | null>(null);
  console.log('Detail screen loaded.');
  const adsRewardedRef =
    React.useRef<GoogleAdsTypes.RewardedAd>(rewardedInstance);
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

  const onGenerateReportButtonPressed = async () => {
    PopupMessage(
      '',
      'This is premium feature, Watch ads to see the bill in detail',
      () => {
        watchAdFromWhichSource.current = 'Report';
        setLoadingAd(true);
        loadAd(adsRewardedRef.current!);
      },
    );
  };

  React.useEffect(() => {
    console.log('Called From DEtail ');
    _.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onGenerateReportButtonPressed}
            style={styles.exportToCSVContainer}>
            <Text style={styles.exportToCSVText}> &#x25a6; Export as csv</Text>
          </TouchableOpacity>
        );
      },
    });

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_.navigation]);

  const _loadAd = () => {
    setLoadingAd(true);
    console.log('Load AD', adsRewardedRef.current);
    loadAd(adsRewardedRef.current!);
  };

  React.useEffect(() => {
    // _.navigation.addListener('focus', () => {
    //   adsRewardedRef.current = rewardedInstance;
    let event: Function | undefined;
    event = adEventHandler(
      adsRewardedRef.current,
      onSuccessRewardAdCallback,
      () => {
        setLoadingAd(false);
      },
      onAdClosed,
      () => {
        watchedAdRef.current = false;
        watchAdFromWhichSource.current = null;
      },
    );

    return () => event!();
    // });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdClosed = () => {
    if (watchedAdRef.current) {
      if (
        watchAdFromWhichSource.current != null &&
        watchAdFromWhichSource.current === 'Report'
      ) {
        _generateCSV();
        watchedAdRef.current = false;
        watchAdFromWhichSource.current = null;
      } else {
        watchedAdRef.current = false;
        watchAdFromWhichSource.current = null;
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
    }
  };
  const onSuccessRewardAdCallback = () => {
    watchedAdRef.current = true;
  };

  const _generateCSV = async () => {
    setGeneratingCsv(true);
    try {
      const yearAndMonth = DayJs.getYearAndMonthFromDate(dateToShowBillsFor);
      const billForCsv = await BillOperations.getBillsByDateInDetailForCSV(
        yearAndMonth,
      );
      if (billForCsv) {
        await buildCSV(billForCsv);
      }
    } catch (err) {
      Toast('Failed to perform operation ' + err.message, 'LONG');
    } finally {
      setGeneratingCsv(false);
    }
  };
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
      {generatingCsv && (
        <View style={styles.overlayCenter}>
          <ActivityLoader loadingText="Generating Csv..." />
        </View>
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
  exportToCSVContainer: {
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    padding: 8,
    borderRadius: 100,
  },
  exportToCSVText: {
    color: '#fff',
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
