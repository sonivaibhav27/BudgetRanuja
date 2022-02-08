import React from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from 'recoil';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {MainStackScreenType} from '../../../../navigations/MainStack/types';
import {OnlyInformationFromBillType, TCategoryType} from '../../../../types';
import {BillsAtom, CategoriesAtom, UtilsAtom} from '../../../../State/Atoms';
import {DayJs, Icons, Miscellaneous, Toast} from '../../../../utils';
import {BillOperations} from '../../../../database';
import RowItem from '../RowItem';
import {GlobalStyle} from '../../../../theme&styles';
import {Input, Modal, PressableButton} from '../../../../common';
import CheckBox from '../CheckBox';
import {UseBannerAD} from '../../../../hooks';

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
  const [date, setDate] = React.useState(DayJs.todayDate());
  const categoryFromRecoil = useRecoilValue(CategoriesAtom.AllCategories);
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [remark, setRemark] = React.useState('');
  const [premiumAndAdConsentState, setPremiumAndAdConsentState] =
    React.useState<{premiumUser: boolean; adConsent: 0 | 1 | 2}>({
      premiumUser: false,
      adConsent: 0,
    });
  const [category, setCategory] = React.useState(
    Category(route.params.comingFrom, categoryFromRecoil)[0]!,
  );
  const [toggleModal, setToggleModal] = React.useState(false);
  const [isCheckedDailyRepeat, setIsCheckedDailyRepeat] = React.useState(false);

  const colorTheme = useRecoilValue(UtilsAtom.ThemeAtom);
  const setCurrentMonthAllBills = useSetRecoilState(
    BillsAtom.CurrentMonthAllBills,
  );

  const amountTextInputRef = React.useRef<TextInput>(null);
  const remarkTextInputRef = React.useRef<TextInput>(null);

  const afterBillCreatedCallback = (
    newlyCreatedBill: OnlyInformationFromBillType,
  ) => {
    if (newlyCreatedBill) {
      setCurrentMonthAllBills(prev => [...prev, newlyCreatedBill]);
    }
  };

  const getUserConsent = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const useConsent = snapshot.getLoadable(UtilsAtom.UserConsent).contents;
        const premiumState = snapshot.getLoadable(
          UtilsAtom.PremiumUser,
        ).contents;

        setPremiumAndAdConsentState({
          adConsent: useConsent,
          premiumUser: premiumState,
        });
      },
    [],
  );
  const call = () => {
    if (remarkTextInputRef.current) {
      remarkTextInputRef.current.focus();
    }
  };

  React.useEffect(() => {
    getUserConsent();
  }, [getUserConsent]);

  const _createBill = async () => {
    try {
      Miscellaneous.ValidateBill(
        {
          categoryId: category.CategoryId!,
          billDate: date.toDate(),
          billType: route.params.comingFrom,
        },
        amount,
      );
      await BillOperations.createBill(
        category.CategoryId!,
        amount,
        date.toDate(),
        route.params.comingFrom,
        route.params.comingFrom === 'expense' ? isCheckedDailyRepeat : false,
        remark,
      );

      afterBillCreatedCallback({
        typeOfBill: route.params.comingFrom,
        categoryId: category.CategoryId!,
        billAmount: isCheckedDailyRepeat
          ? +amount *
            (DayJs.getLastDayOfMonth() - DayJs.todayDate().get('date') + 1)
          : +amount,
      });
      Toast('Bill created succesfully.', 'LONG');
    } catch (err) {
      if (err.name === 'ApplicationError') {
        Toast(err.message, 'SHORT');
        return;
      }
      Toast('Something went wrong wrong.', 'SHORT');
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
      {route.params.comingFrom === 'expense' && (
        <RowItem
          childrenStyle={{alignItems: 'flex-end', backgroundColor: '#fff'}}
          text="Repeat Daily till last of month">
          <Pressable
            hitSlop={{left: 5, bottom: 5, right: 5}}
            onPress={() => setIsCheckedDailyRepeat(prev => !prev)}>
            <CheckBox isChecked={isCheckedDailyRepeat} />
          </Pressable>
        </RowItem>
      )}
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

      <View>
        <PressableButton
          onPress={_createBill}
          style={[styles.saveContainer, {backgroundColor: colorTheme.primary}]}>
          <Text style={styles.saveText}>Save</Text>
        </PressableButton>
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
      <View style={styles.adContainer}>
        <UseBannerAD
          consentStatus={premiumAndAdConsentState.adConsent}
          premiumUser={premiumAndAdConsentState.premiumUser}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  saveContainer: {
    alignSelf: 'center',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: 20,
    width: 200,
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
  adContainer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default CreateScreen;
