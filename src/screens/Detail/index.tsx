import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  I18nManager,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MonthPicker, {ACTION_DATE_SET} from 'react-native-month-year-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilCallback, useSetRecoilState} from 'recoil';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {AuditSection, ActionButtons, DataSection} from './components';
import {buildCSV, DayJs, Icons, Toast} from '../../utils';
import {BillOperations, BudgetOperations} from '../../database';
import {BillsAtom, BudgetAtom, DetailState} from '../../State/Atoms';
import {ActivityLoader} from '../../common';

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
  const [generatingCsv, setGeneratingCsv] = React.useState(false);
  const [dateToShowBillsFor, setDateToShowBillsFor] = React.useState(
    new Date(),
  );
  const [monthPickerVisible, setMonthPickerVisible] = React.useState(false);
  const toggleMonthPicker = () => {
    setMonthPickerVisible(!monthPickerVisible);
  };

  const setDetailAllBills = useSetRecoilState(DetailState.DetailAllBills);
  const setDetailBudget = useSetRecoilState(BudgetAtom.DetailBudgetAtom);
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
    setGeneratingCsv(true);
    try {
      const yearAndMonth = DayJs.getYearAndMonthFromDate(dateToShowBillsFor);
      const billForCsv = await BillOperations.getBillsByDateInDetailForCSV(
        yearAndMonth,
      );
      if (billForCsv) {
        await buildCSV(billForCsv);
      }
      Alert.alert('CSV File Successfully saved .');
    } catch (err) {
      Toast('Failed to perform operation ' + err.message, 'LONG');
    } finally {
      setGeneratingCsv(false);
    }
  };

  React.useEffect(() => {
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
  }, []);

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
