import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  I18nManager,
  Pressable,
} from 'react-native';

import MonthPicker, {
  ACTION_DATE_SET,
  ACTION_DISMISSED,
  ACTION_NEUTRAL,
} from 'react-native-month-year-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {AuditSection, ActionButtons, DataSection} from './components';
import {Icons} from '../../utils';

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
export default (props: Props) => {
  const {height} = useWindowDimensions();
  const [month, setMonth] = React.useState(new Date());
  const [monthPickerVisible, setMonthPickerVisible] = React.useState(false);

  React.useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.saveToDriveContainer}>
            <Icons.Entypo name="google-drive" color="#000" size={25} />
            <Text style={styles.saveToDriveText}>Save to drive</Text>
          </View>
        );
      },
    });
  }, [props.navigation]);

  const toggleMonthPicker = () => {
    setMonthPickerVisible(!monthPickerVisible);
  };

  const callMonthPickerFunction = (event: string, newDate: Date) => {
    console.log(event);
    switch (event) {
      case ACTION_DATE_SET:
        toggleMonthPicker();
        setMonth(newDate);
        // onSuccess(newDate);
        break;
      case ACTION_NEUTRAL:
        // onNeutral(newDate);
        toggleMonthPicker();
        break;
      case ACTION_DISMISSED:
        toggleMonthPicker();
        break;
      default:
        toggleMonthPicker();
      // onCancel()x; //when ACTION_DISMISSED new date will be undefined
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.currentMonthContainer}
        onPress={toggleMonthPicker}>
        <Text style={styles.currentMonthText}>
          {formateDateToGetMonthAndYear(month)}
        </Text>
        <Icons.Fontisto size={20} name="date" color="#000" />
      </Pressable>
      <View>
        <ActionButtons />
      </View>
      <View style={styles.dataContainer}>
        <DataSection />
      </View>
      <View style={{height: height * 0.12}}>
        <AuditSection />
      </View>
      {/* <MonthYearPicker /> */}
      {monthPickerVisible && (
        <MonthPicker
          locale="en"
          onChange={callMonthPickerFunction}
          value={month}
        />
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
  },
  currentMonthText: {
    fontSize: 20,
    padding: 8,
    color: '#000',
    fontWeight: '700',
  },
});
