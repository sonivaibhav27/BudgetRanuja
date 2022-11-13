import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import MonthPicker, {ACTION_DATE_SET} from 'react-native-month-year-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {AuditSection, ActionButtons, DataSection} from './components';

import Utils from '../../../utils';
import {NavigationTypes} from '../../../../types';
import {BillState, BudgetState} from '../../../state';
import {DateHelper, Icons} from '../../../helper';
import {BillOperations, BudgetOperations} from '../../../../database';
import {
  Header,
  Loader,
  Pressable,
  PressableTextButton,
  Text,
} from '../../../components';
import CommonStyles from '../../../styles';
import {COLORS} from '../../../theme';

type Props = {
  navigation: StackNavigationProp<NavigationTypes.TDetailStackScreen, 'Detail'>;
};

const MONTHS = Utils.getMonths();

const formateDateToGetMonthAndYear = (date: Date) => {
  return `${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
};
const {width, height} = Dimensions.get('window');
export default (_: Props) => {
  const [dateToShowBillsFor, setDateToShowBillsFor] = React.useState(
    new Date(),
  );
  const [monthPickerVisible, setMonthPickerVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const setDetailAllBills = useSetRecoilState(
    BillState.basedOnMonthSelectedAllBillsAtom,
  );
  const setDetailBudget = useSetRecoilState(BudgetState.detailBudgetAtom);
  const currentMonthBills = useRecoilValue(BillState.currentMonthAllBillsAtom);
  const currentMonthBudget = useRecoilValue(BudgetState.currentMonthBudgetAtom);

  React.useEffect(() => {
    setDetailAllBills(currentMonthBills);
    setDetailBudget(currentMonthBudget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonthBills]);

  const toggleMonthPicker = () => {
    setMonthPickerVisible(!monthPickerVisible);
  };

  const callMonthPickerFunction = async (event: string, newDate: Date) => {
    switch (event) {
      case ACTION_DATE_SET:
        toggleMonthPicker();
        setLoading(true);
        setDateToShowBillsFor(newDate);
        const yearAndMonth = DateHelper.getYearAndMonthFromDate(newDate);
        const bills = await BillOperations.getCurrentMonthBills(yearAndMonth);
        const budget = await BudgetOperations.getCurrentMonthBudget(
          yearAndMonth,
        );
        setLoading(false);
        setDetailAllBills(bills != null ? bills : []);
        setDetailBudget(budget || -1);
        break;
      default:
        toggleMonthPicker();
    }
  };

  return (
    <View style={CommonStyles.flex1}>
      <Header
        textAlign="left"
        headerTitle="Detail"
        headerRight={
          <PressableTextButton
            style={styles.reportContainer}
            textStyle={{
              color: COLORS.white,
            }}
            text="&#x25a6;  Reports"
            onPress={() => {
              _.navigation.navigate('Report');
            }}
          />
        }
      />
      <Pressable
        style={styles.currentMonthContainer}
        onPress={toggleMonthPicker}>
        <Icons.Fontisto size={20} name="date" color={'#FFF'} />
        <Text textType="paragraph" style={styles.currentMonthText}>
          {formateDateToGetMonthAndYear(dateToShowBillsFor)}
        </Text>
        <View style={styles.arrowDown}>
          <Icons.Entypo size={20} name="chevron-down" color={'#FFF'} />
        </View>
      </Pressable>
      <ActionButtons />
      <View style={CommonStyles.flex1}>
        {!loading && (
          <DataSection
            monthAndYearOfBillToShow={DateHelper.getYearAndMonthFromDate(
              dateToShowBillsFor,
            )}
          />
        )}
      </View>
      <View style={{height: height * 0.12}}>
        <AuditSection />
      </View>
      {monthPickerVisible && (
        <MonthPicker
          locale="en"
          onChange={callMonthPickerFunction}
          value={dateToShowBillsFor}
        />
      )}
      <Loader show={loading} loadingText="Getting Data..." />
    </View>
  );
};

const styles = StyleSheet.create({
  currentMonthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    // alignSelf: 'flex-start',
    padding: 6,
    marginTop: 13,
    // borderColor: '#ddd',
    marginHorizontal: 10,
    // backgroundColor: 'rgba(163,94,0,0.07)',
    backgroundColor: COLORS.primary,
    width: width * 0.8,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  currentMonthText: {
    fontSize: 17,
    padding: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  arrowDown: {
    position: 'absolute',
    right: 20,
  },
  reportContainer: {
    backgroundColor: COLORS.greenReport,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
  },
});
