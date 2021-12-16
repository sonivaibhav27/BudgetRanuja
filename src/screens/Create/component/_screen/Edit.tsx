import React from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRecoilValue} from 'recoil';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackScreenType} from '../../../../navigations/MainStack/types';
import {TCategoryType} from '../../../../types';
import {CategoriesAtom} from '../../../../State/Atoms';
import {DayJs, Icons, Miscellaneous, Toast} from '../../../../utils';
import RowItem from '../RowItem';
import {GlobalStyle, Theme} from '../../../../theme&styles';
import {Input, Modal, PressableButton} from '../../../../common';
import {BillOperations} from '../../../../database';

type Props = {
  route: RouteProp<MainStackScreenType, 'Create'>;
};

const Category = (type: 'income' | 'expense', data: TCategoryType[]) => {
  return type === 'income'
    ? data.filter(
        item => item.CategoryType! === 'income' && item.IsDeleted === 0,
      )
    : data.filter(
        item => item.CategoryType! === 'expense' && item.IsDeleted === 0,
      );
};

const CreateScreen = ({route}: Props) => {
  const routeParam = route.params.categoryData;
  console.log({routeParam});
  const [date, setDate] = React.useState(
    DayJs.dayjsDate(routeParam?.billDate!),
  );
  const categoryFromRecoil = useRecoilValue(CategoriesAtom.AllCategories);
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const [amount, setAmount] = React.useState(
    routeParam?.billAmount?.toString(),
  );
  const [remark, setRemark] = React.useState(routeParam?.billRemark);
  const [category, setCategory] = React.useState(
    Category(route.params.comingFrom, categoryFromRecoil).find(
      item => item.CategoryId === routeParam?.categoryId!,
    )! || '',
  );
  const [toggleModal, setToggleModal] = React.useState(false);

  const amountTextInputRef = React.useRef<TextInput>(null);
  const remarkTextInputRef = React.useRef<TextInput>(null);

  const call = () => {
    if (remarkTextInputRef.current) {
      remarkTextInputRef.current.focus();
    }
  };

  const _deleteBill = async () => {
    Alert.alert('Are you sure?', 'Deleted bill will not get recovered again.', [
      {
        text: 'Cancel',
      },
      {
        text: 'Ok',
        onPress: async () => {
          if (routeParam && routeParam.id.length > 0) {
            const isSuccess = await BillOperations.deleteBill(routeParam.id);
            if (isSuccess) {
              if (DayJs.isDateExistInCurrentMonth(date.toDate())) {
                Alert.alert(
                  '',
                  'Reload the app to reflect changes to home screen, as  bill date lies in current month',
                );
              }
            }
          }
        },
      },
    ]);
  };
  const _editBill = async () => {
    try {
      Miscellaneous.ValidateEditBill(
        {
          categoryId: category.CategoryId!,
          billDate: date.toDate(),
          billType: route.params.comingFrom,
        },
        amount!,
        routeParam?.id,
      );
      if (routeParam) {
        await BillOperations.updateBill(
          routeParam.id,
          amount!,
          date.toDate(),
          routeParam.billType!,
          remark!,
          category.CategoryId!,
        );
        if (DayJs.isDateExistInCurrentMonth(date.toDate())) {
          Alert.alert(
            '',
            'Reload the app to reflect changes to home screen, as  edited bill date lies in current month',
          );
        }
      }
    } catch (err) {
      console.log(err);
      if (err.name === 'ApplicationError') {
        Toast(err.message, 'LONG');
        return;
      }
    }
  };

  const toggleModalToChoseCategory = () => {
    setToggleModal(prevState => !prevState);
  };

  return (
    <SafeAreaView style={styles.flex}>
      <RowItem
        text={
          route.params.comingFrom === 'expense' ? 'Category' : 'Mode of Payment'
        }>
        <Pressable
          style={styles.categoryContainer}
          onPress={toggleModalToChoseCategory}>
          <Text style={GlobalStyle.GlobalCommonStyles.textStyle}>
            {category.CategoryName}
          </Text>
          <Icons.Entypo name={'chevron-down'} size={25} color={'#000'} />
        </Pressable>
      </RowItem>

      <RowItem text="Amount">
        <Input
          style={GlobalStyle.GlobalCommonStyles.textStyle}
          ref={amountTextInputRef}
          value={amount || ''}
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
          value={remark || ''}
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
            setDate(DayJs.dayjsDate(newDate));
            setOpenDatePicker(false);
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <PressableButton
          onPress={_deleteBill}
          style={[
            styles.saveContainer,
            {backgroundColor: Theme.ColorsTheme.expense.borderColor},
          ]}>
          <Text style={styles.saveText}>Delete</Text>
        </PressableButton>
        <Pressable
          onPress={_editBill}
          style={[
            styles.saveContainer,
            {backgroundColor: Theme.ColorsTheme.primary},
          ]}>
          <Text style={styles.saveText}>Edit</Text>
        </Pressable>
      </View>

      {toggleModal && (
        <Modal
          closeModal={toggleModalToChoseCategory}
          onItemSelect={item => {
            console.log(item);
            setCategory(item);
          }}
          data={Category(route.params.comingFrom, categoryFromRecoil)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  saveContainer: {
    alignSelf: 'center',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
    flex: 1,
    marginHorizontal: 10,
    maxWidth: 200,
  },
  saveText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f1f1',
  },
  flex: {flex: 1},
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default CreateScreen;
