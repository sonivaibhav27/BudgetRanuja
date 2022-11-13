import React from 'react';
import {View, StyleSheet, ScrollView, Vibration} from 'react-native';
import {useRecoilCallback} from 'recoil';
import MonthPicker, {ACTION_DATE_SET} from 'react-native-month-year-picker';
import {CategoriesTypes, UtilTypes} from '../../../../types';
import {CategoryState} from '../../../state';
import {
  BottomSheet,
  CategoriesToDisplay,
  Pressable,
  PressableTextButton,
  Text,
  ViewText,
} from '../../../components';
import {BuildCsv, DateHelper} from '../../../helper';
import {BillOperations} from '../../../../database';
import CommonStyles from '../../../styles';
import {COLORS, PADDING} from '../../../theme';
import Utils from '../../../utils';

export default () => {
  const bottomSheetRef = React.useRef<UtilTypes.TBottomSheetRef>(null);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoriesTypes.TCategories>();
  // const [premiumState, setPremiumState] = React.useState(false);

  const [categoryData, setCategoryData] = React.useState<
    CategoriesTypes.TCategories[]
  >([]);
  const [whatVisible, setWhatVisible] = React.useState<
    'date' | 'category' | undefined
  >();
  const [monthAndYear, setMonthAndYear] = React.useState<Date | undefined>();

  const getCategoriesFromRecoil = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const data = snapshot.getLoadable(
          CategoryState.allCategoryAtom,
        ).contents;
        setCategoryData(data);
        // const isPremium = snapshot.getLoadable(
        //   UtilState.premiumUtilAtom,
        // ).contents;
        // setPremiumState(isPremium);
      },
    [],
  );

  React.useEffect(() => {
    getCategoriesFromRecoil();
  }, [getCategoriesFromRecoil]);

  const toggleWhatVisible = (clickedOn: 'date' | 'category' | undefined) => {
    setWhatVisible(clickedOn);
  };
  const callMonthPickerFunction = (event: string, newDate: Date) => {
    //to close the current modal.
    setWhatVisible(undefined);
    switch (event) {
      case ACTION_DATE_SET:
        setMonthAndYear(newDate);
        break;
      default:
    }
  };

  const onReportGenerationpress = async () => {
    try {
      const granted = await Utils.checkOrRequestStoragePermission();
      if (granted) {
        if (typeof monthAndYear === 'undefined') {
          Utils.makeAlert(
            '',
            'Select Month and Year to generate report.',
            () => {},
            false,
          );

          return;
        }
        generateCsv();
      }
    } catch (err) {
      Utils.makeToast('Failed to get storage permissions');
    }
  };

  const generateCsv = async () => {
    console.log('Month And Year', monthAndYear);
    try {
      const billsData = await BillOperations.generateReportData(
        monthAndYear!,
        selectedCategory?.CategoryId!,
      );
      if (billsData?.length === 0) {
        Utils.makeToast('No Bills found for the selected month');
        return;
      }
      if (typeof billsData !== 'undefined') {
        await BuildCsv(billsData, selectedCategory ? true : false);
      }
      Vibration.vibrate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={[CommonStyles.screenContainer, styles.container]}>
        <Text textType="normal" style={styles.getReportText}>
          Generate Report
        </Text>
        <Pressable
          style={styles.input}
          onPress={() => toggleWhatVisible('date')}>
          <ViewText
            text={
              monthAndYear
                ? DateHelper.getOnlyMonthAndYear(monthAndYear)
                : 'Select Month & Year'
            }
          />
        </Pressable>
        <Pressable
          style={styles.input}
          onPress={() => toggleWhatVisible('category')}>
          <ViewText
            text={
              typeof selectedCategory !== 'undefined'
                ? selectedCategory.CategoryName!
                : 'Select Category'
            }
          />
        </Pressable>
        <PressableTextButton
          textStyle={styles.exportToCSVText}
          onPress={onReportGenerationpress}
          textType="normal"
          style={styles.exportToCSVContainer}
          text="&#x25a6; Export as csv"
        />
        <Text textType="paragraph" style={styles.noteText}>
          if no category is selected, all categories will be added in downloaded
          csv
        </Text>
        {whatVisible === 'date' && (
          <MonthPicker
            locale="en"
            onChange={callMonthPickerFunction}
            value={new Date()}
          />
        )}
      </View>
      {whatVisible === 'category' && (
        <BottomSheet
          ref={bottomSheetRef}
          close={() => {
            toggleWhatVisible(undefined);
          }}>
          <ScrollView persistentScrollbar>
            <CategoriesToDisplay
              categories={categoryData}
              title="Categories"
              onItemPress={category => {
                setSelectedCategory(category);
                if (bottomSheetRef.current) {
                  bottomSheetRef.current.close();
                }
              }}
            />
          </ScrollView>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  getReportText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
    fontWeight: '600',
    // fontFamily: GlobalStyle.Font.SemiBold,
  },
  input: {
    padding: PADDING.mediumBig,
    backgroundColor: '#fff',
    borderWidth: 0.4,
    borderRadius: 3,
    borderColor: '#888',
    marginHorizontal: 30,
    marginBottom: 10,
  },
  exportToCSVContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenReport,
    alignSelf: 'center',
    padding: PADDING.big,
    marginTop: 30,
    borderRadius: 4,
  },
  exportToCSVText: {
    color: '#fff',
    fontSize: 18,
  },
  noteText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
    textTransform: 'capitalize',
  },
});
