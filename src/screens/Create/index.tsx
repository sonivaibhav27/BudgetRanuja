import React from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {RowItem} from './component';
import {DayJs, Icons, Logger} from '../../utils';
import {UtilsAtom} from '../../State';
import {Input, Modal} from '../../common';
import {ExpenseCategories, IncomeCategories} from '../../data';
import {GlobalStyle} from '../../theme&styles';
import {DetailState} from '../../State/Atoms';
import {ModelTypes} from '../../database';
import {RouteProp} from '@react-navigation/native';
import {BillOperations} from '../../database/operations';

type Props = {
  route: RouteProp<MainStackScreenType, 'Create'>;
};

const Category = (type: 'income' | 'expense') => {
  return type === 'income' ? IncomeCategories : ExpenseCategories;
};

const CreateScreen = ({route}: Props) => {
  const [date, setDate] = React.useState(DayJs.todayDate());
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [remark, setRemark] = React.useState('');
  const [category, setCategory] = React.useState(
    Category(route.params.comingFrom)[0],
  );

  const [toggleModal, setToggleModal] = React.useState(false);
  const colorTheme = useRecoilValue(UtilsAtom.ThemeAtom);
  const setExpenseData = useSetRecoilState(DetailState.ExpensesAtom);
  const setIncomeData = useSetRecoilState(DetailState.IncomeAtom);

  const amountTextInputRef = React.useRef<TextInput>(null);
  const remarkTextInputRef = React.useRef<TextInput>(null);

  // amountTextInputRef.current.

  const afterBillCreatedCallback = (newlyCreatedBill: any) => {
    console.log('Inside Callback');
    if (newlyCreatedBill) {
      if (newlyCreatedBill.billType === 2) {
        setExpenseData(prevData => {
          let previousExpenses = [...prevData];
          return [...previousExpenses, newlyCreatedBill];
        });
      } else {
        setIncomeData(prevData => {
          let previousIncome = [...prevData];
          return [...previousIncome, newlyCreatedBill];
        });
      }
    }
  };

  const call = () => {
    if (remarkTextInputRef.current) {
      remarkTextInputRef.current.focus();
    }
  };

  const _createBill = async () => {
    try {
      const record = await BillOperations.createBill(
        category,
        +amount,
        new Date(),
        route.params.comingFrom,
        '',
      );
      afterBillCreatedCallback({
        billType: route.params.comingFrom === 'income' ? 1 : 2,
        billCategory: category,
        billAmount: +amount,
        billRemark: remark,
      });
      Logger.consoleLog(record, 'log');
    } catch (err) {
      Logger.consoleLog(err, 'error');
    }
  };

  const toggleModalToChoseCategory = () => {
    setToggleModal(prevState => !prevState);
  };

  return (
    <View style={styles.flex}>
      <RowItem
        text={
          route.params.comingFrom === 'expense' ? 'Category' : 'Mode of Payment'
        }>
        <Pressable
          style={styles.categoryContainer}
          onPress={toggleModalToChoseCategory}>
          <Text style={GlobalStyle.GlobalCommonStyles.textStyle}>
            {category}
          </Text>
          <Icons.Entypo name={`chevron-down`} size={25} color={'#000'} />
        </Pressable>
      </RowItem>

      <RowItem text="Amount">
        <Input
          style={GlobalStyle.GlobalCommonStyles.textStyle}
          ref={amountTextInputRef}
          value={amount}
          onChangeText={newAmount => setAmount(newAmount)}
          keyboardType="number-pad"
          onSubmitEditing={call}
          maxLength={15}
          autoFocus
        />
      </RowItem>
      <RowItem
        onPress={() => {
          setOpenDatePicker(!openDatePicker);
        }}
        text="Date">
        <Text style={GlobalStyle.GlobalCommonStyles.textStyle}>
          {date.format('DD/MM/YYYY')}
        </Text>
      </RowItem>
      <RowItem text="Remark">
        <Input
          style={GlobalStyle.GlobalCommonStyles.textStyle}
          ref={remarkTextInputRef}
          value={remark}
          onChangeText={newRemark => setRemark(newRemark)}
        />
      </RowItem>

      {openDatePicker && (
        <DateTimePicker
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          value={date.toDate()}
          mode={'date'}
          onChange={({nativeEvent}: {nativeEvent: any}) => {
            const newDate = nativeEvent.timestamp || date;
            setDate(dayjs(newDate));
            setOpenDatePicker(false);
          }}
        />
      )}

      <View>
        <Pressable
          onPress={_createBill}
          style={[styles.saveContainer, {backgroundColor: colorTheme.primary}]}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      {toggleModal && (
        <Modal
          closeModal={toggleModalToChoseCategory}
          onItemSelect={item => setCategory(item)}
          data={Category(route.params.comingFrom)}
        />
      )}
      <Text style={{color: '#000'}}>{route.params.comingFrom}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  saveContainer: {
    alignSelf: 'center',
    padding: 10,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 2,
  },
  saveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
  flex: {flex: 1},
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CreateScreen;
