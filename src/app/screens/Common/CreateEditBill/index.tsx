import React from 'react';
import {Platform, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StackScreenProps} from '@react-navigation/stack';
import {CategoriesTypes, NavigationTypes, UtilTypes} from '../../../../types';
import CommonStyles from '../../../../app/styles';
import {DateHelper, Icons, Validator} from '../../../../app/helper';
import {COLORS, PADDING} from '../../../theme';
import {BillOperations, DbUtils} from '../../../../database';
import Utils from '../../../utils';
import {
  BottomSheet,
  CategoriesToDisplay,
  Pressable,
  PressableIconButton,
  PressableTextButton,
  RowItemWithLabel,
  Text,
  TextInput,
} from '../../../components';
import {Dayjs} from 'dayjs';
import {useEditBill} from '../../../hooks';

type Props = StackScreenProps<
  NavigationTypes.TSettingStackScreen & NavigationTypes.TRootStackScreens,
  'CreateEditScreen'
>;

const {height} = Dimensions.get('window');

const CreateEditScreen = ({navigation, route}: Props) => {
  const initialData = route.params.billData;
  const isValidRouteParams = Utils.isValidObject(initialData);

  const bottomSheetRef = React.useRef<UtilTypes.TBottomSheetRef>(null);

  const {
    screenData,
    selectedBillType,
    setCategoriesToShow,
    setCurrentMonthAllBills,
    setScreenData,
    setSelectedType,
    categoryFromRecoil,
    categoriesToShow,
  } = useEditBill(route.params.typeOfScreen, initialData);

  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const [toggleModal, setToggleModal] = React.useState(false);

  const afterBillCreatedCallback = (
    newlyCreatedBill: UtilTypes.TOnlyInformationFromBill,
  ) => {
    if (newlyCreatedBill) {
      setCurrentMonthAllBills(prev => [...prev, newlyCreatedBill]);
    }
  };

  const createBill = async () => {
    const {category, date, amount, remark} = screenData;
    if (route.params.typeOfScreen === 'Create') {
      try {
        Validator.validateBill({
          categoryId: category.CategoryId!,
          billDate: date.toDate(),
          billType: selectedBillType,
          billAmount: +amount,
        });
        await BillOperations.createBill(
          category.CategoryId!,
          amount,
          date.toDate(),
          selectedBillType,
          false,
          remark,
        );

        afterBillCreatedCallback({
          typeOfBill: selectedBillType,
          categoryId: category.CategoryId!,
          billAmount: +amount,
        });
        Utils.makeToast('Bill created succesfully.', 'LONG');
      } catch (err: any) {
        if (err.name === 'ApplicationError') {
          Utils.makeToast(err.message, 'SHORT');
          return;
        }
        Utils.makeToast('Something went wrong wrong.', 'SHORT');
      }
    } else if (route.params.typeOfScreen === 'Edit') {
      try {
        Validator.validateBillWithId(
          {
            billAmount: +screenData.amount,
            billDate: screenData.date.toDate(),
            categoryId: screenData.category.CategoryId!,
            billType: screenData.category.CategoryType,
            billRemark: screenData.remark,
          },
          //TODO: Bill primary Id
          initialData?.id,
        );
        if (initialData) {
          await BillOperations.updateBill(
            initialData.id,
            amount!,
            date.toDate(),
            screenData.category.CategoryType!,
            remark!,
            category.CategoryId!,
          );
          if (DateHelper.isDateExistInCurrentMonth(date.toDate())) {
            Utils.makeAlert(
              '',
              'Reload the app to reflect changes to home screen, as  edited bill date lies in current month',
              () => {},
              false,
            );
          }
        }
      } catch (err: any) {
        console.log(err);
        if (err.name === 'ApplicationError') {
          Utils.makeToast(err.message, 'LONG');
          return;
        }
        Utils.makeToast(err?.message);
      }
    }
  };

  const toggleModalToChoseCategory = () => {
    setToggleModal(prevState => !prevState);
  };

  const setData = (
    property: 'category' | 'amount' | 'remark' | 'date',
    value: string | Dayjs | CategoriesTypes.TCategories,
  ) => {
    const internalData = {
      ...screenData,
      [property]: value,
    };
    console.log({internalData});
    setScreenData(internalData);
  };

  React.useEffect(() => {
    if (
      route.params.typeOfScreen === 'Create' ||
      (route.params.typeOfScreen === 'Edit' &&
        screenData.category.IsDeleted === 0)
    ) {
      navigation.setOptions({
        headerRight: () => (
          <PressableTextButton
            disabled={toggleModal}
            textStyle={styles.primaryText}
            style={styles.saveBtn}
            onPress={createBill}
            text="Save"
            textType="subheading"
          />
        ),
      });
    } else if (
      route.params.typeOfScreen === 'Edit' &&
      screenData.category.IsDeleted === 1
    ) {
      navigation.setOptions({
        headerRight: () => null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    screenData.amount,
    screenData.date,
    screenData.remark,
    screenData.category.CategoryId,
  ]);

  const setSelection = (selection: 'expense' | 'income') => {
    if (selectedBillType !== selection) {
      setSelectedType(selection);
      const categories = DbUtils.getActiveCategoriesByCategoryType(
        selection,
        categoryFromRecoil,
      );

      setCategoriesToShow(categories);
      const first = categories[0];
      setData('category', first);
    }
  };

  const deleteBill = async () => {
    Utils.makeAlert(
      'Are you sure?',
      'Deleted bill will not get recovered again.',
      async () => {
        if (isValidRouteParams && route.params.billData!.id.length > 0) {
          const isSuccess = await BillOperations.deleteBill(
            route.params.billData!.id,
          );
          if (isSuccess) {
            if (
              DateHelper.isDateExistInCurrentMonth(screenData.date.toDate())
            ) {
              Utils.makeAlert(
                '',
                'Reload the app to reflect changes to home screen, as  bill date lies in current month',
                () => {},
                false,
              );
            }
          }
        }
      },
      false,
    );
  };

  return (
    <View style={CommonStyles.flex1}>
      <ScrollView style={[CommonStyles.flex1, styles.container]}>
        {route.params.typeOfScreen === 'Create' && (
          <View style={styles.incomeExpenseSelectionContainer}>
            <>
              <PressableTextButton
                onPress={() => setSelection('expense')}
                style={[
                  CommonStyles.flex1,
                  styles.commonSelection,
                  selectedBillType === 'expense'
                    ? styles.selectedSelection
                    : styles.unselectedSelection,
                ]}
                textStyle={
                  selectedBillType === 'expense'
                    ? styles.whiteText
                    : styles.blackText
                }
                text="Expense"
              />
              <PressableTextButton
                onPress={() => setSelection('income')}
                style={[
                  CommonStyles.flex1,
                  styles.commonSelection,
                  selectedBillType === 'income'
                    ? styles.selectedSelection
                    : styles.unselectedSelection,
                ]}
                textStyle={
                  selectedBillType === 'income'
                    ? styles.whiteText
                    : styles.blackText
                }
                text="Income"
              />
            </>
          </View>
        )}
        <RowItemWithLabel
          text={
            selectedBillType === 'expense' ? 'Category' : 'Mode of Payment'
          }>
          <Pressable
            style={styles.categoryContainer}
            onPress={toggleModalToChoseCategory}>
            <Text textType="paragraph">
              {screenData.category!.CategoryName!}
            </Text>
            <Icons.Entypo
              name={toggleModal ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.black}
            />
          </Pressable>
        </RowItemWithLabel>
        {!isValidRouteParams && (
          <PressableTextButton
            onPress={() => {
              navigation.navigate('Settings', {
                openModal: 'Categories',
              });
            }}
            textStyle={styles.addEditCategoryText}
            style={styles.addEditCategory}
            text="&#x2b; Add/Edit Category"
            textType="normal"
          />
        )}
        <RowItemWithLabel text="Amount">
          <View
            style={[
              CommonStyles.displayRow,
              styles.input,
              styles.inputContainer,
            ]}>
            <Icons.Foundation name="dollar" size={25} color={COLORS.secondry} />
            <TextInput
              placeholder="Add Amount"
              value={screenData.amount}
              onChangeText={newAmount => setData('amount', newAmount)}
              keyboardType="number-pad"
              maxLength={15}
              style={styles.textInput}
            />
          </View>
        </RowItemWithLabel>
        <RowItemWithLabel text="Date">
          <PressableIconButton
            iconStyle={{
              color: COLORS.secondry,
              size: 20,
            }}
            iconName="calendar"
            iconFamily="AntDesign"
            text={screenData.date.format('DD/MM/YYYY')}
            onPress={() => {
              setOpenDatePicker(true);
            }}
            style={styles.input}
          />
        </RowItemWithLabel>
        <RowItemWithLabel text="Remark">
          <View
            style={[
              CommonStyles.displayRow,
              styles.input,
              styles.inputContainer,
            ]}>
            <Icons.Ionicons
              name="document-outline"
              size={20}
              color={COLORS.secondry}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Add remark"
              value={screenData.remark}
              onChangeText={newRemark => setData('remark', newRemark)}
            />
          </View>
        </RowItemWithLabel>
      </ScrollView>
      {openDatePicker && (
        <DateTimePicker
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          value={screenData.date.toDate()}
          mode={'date'}
          onChange={({nativeEvent}: {nativeEvent: any}) => {
            const newDate = nativeEvent.timestamp || screenData.date;
            setOpenDatePicker(false);
            setData('date', DateHelper.dayjsDate(newDate));
          }}
        />
      )}
      {isValidRouteParams && (
        <PressableTextButton
          text="Delete"
          textStyle={styles.deleteText}
          onPress={deleteBill}
          style={styles.delete}
          textType="normal"
        />
      )}
      {toggleModal && (
        <BottomSheet
          height={height * 0.7}
          ref={bottomSheetRef}
          close={toggleModalToChoseCategory}>
          <ScrollView persistentScrollbar>
            <CategoriesToDisplay
              categories={categoriesToShow}
              title="Categories"
              onItemPress={category => {
                setData('category', category);
                if (bottomSheetRef.current) {
                  bottomSheetRef.current.close();
                }
              }}
            />
          </ScrollView>
        </BottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    paddingHorizontal: PADDING.big,
  },
  saveBtn: {
    marginHorizontal: PADDING.big,
    padding: 8,
    paddingHorizontal: PADDING.big,
    borderRadius: 4,
    marginTop: 5,
  },
  whiteText: {
    color: COLORS.white,
    fontSize: 18,
  },
  addEditCategory: {
    alignSelf: 'flex-end',
    paddingHorizontal: PADDING.mediumBig,
  },
  addEditCategoryText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  incomeExpenseSelectionContainer: {
    flexDirection: 'row',
    marginTop: 30,
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  commonSelection: {
    padding: PADDING.mediumBig,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSelection: {
    backgroundColor: COLORS.primary,
  },
  unselectedSelection: {
    backgroundColor: COLORS.lightGray,
  },
  blackText: {
    color: COLORS.black,
    fontSize: 18,
  },
  primaryText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  input: {
    color: '#000',
    padding: 0,
    marginBottom: 0,
    alignItems: 'center',
    flex: 1,
    top: 2,
    borderWidth: 0,
  },
  delete: {
    backgroundColor: COLORS.red,
    padding: PADDING.big,
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: COLORS.lightRed,
    fontSize: 16,
    textAlign: 'center',
    // textAlign: 'center',
  },
  textInput: {
    flex: 1,
    padding: 0,
    top: 2,
    marginLeft: 10,
    color: COLORS.black,
  },
  inputContainer: {
    paddingHorizontal: 5,
  },
});

export default CreateEditScreen;
