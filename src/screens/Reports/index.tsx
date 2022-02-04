import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ActivityLoader, Modal, PressableButton} from '../../common';
import MonthPicker, {ACTION_DATE_SET} from 'react-native-month-year-picker';
import {TCategoryType} from '../../types';
import {useRecoilCallback} from 'recoil';
import {CategoriesAtom, UtilsAtom} from '../../State/Atoms';
import {buildCSV, DayJs, PopupMessage} from '../../utils';
import {GlobalStyle} from '../../theme&styles';
import {BillOperations} from '../../database';
import UseRewardAd from '../../hooks/Ads/RewardAdNew';

type InputBoxProps = {
  name: string;
};
const InputBox = (props: InputBoxProps) => {
  return (
    <View style={styles.input}>
      <Text style={styles.name}>{props.name}</Text>
    </View>
  );
};

export default () => {
  const [category, setCategory] = React.useState<string>('');
  const [premiumState, setPremiumState] = React.useState(false);
  const [adDismissed, loadAd, dismissedCallback, rewardedModify] =
    UseRewardAd();
  const [categoryData, setCategoryData] = React.useState<TCategoryType[]>([]);
  const [whatVisible, setWhatVisible] = React.useState<
    'date' | 'category' | undefined
  >();
  const [monthAndYear, setMonthAndYear] = React.useState<Date | undefined>();
  const [loadingAd, setLoadingAd] = React.useState<boolean>(false);

  const GetCategoriesFromRecoil = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const data = snapshot.getLoadable(
          CategoriesAtom.AllCategories,
        ).contents;
        setCategoryData(data);
        const useConsent = snapshot.getLoadable(UtilsAtom.UserConsent).contents;
        rewardedModify(useConsent);
        const isPremium = snapshot.getLoadable(UtilsAtom.PremiumUser).contents;
        setPremiumState(isPremium);
      },

    [],
  );

  React.useEffect(() => {
    GetCategoriesFromRecoil();
  }, [GetCategoriesFromRecoil]);

  const onInputPress = (clickedOn: 'date' | 'category') => {
    setWhatVisible(clickedOn);
  };
  const callMonthPickerFunction = (event: string, newDate: Date) => {
    setWhatVisible(undefined);
    switch (event) {
      case ACTION_DATE_SET:
        console.log(typeof newDate);
        setMonthAndYear(newDate);
        break;
      default:
    }
  };

  const GenerateCSV = async () => {
    if (typeof monthAndYear === 'undefined') {
      PopupMessage(
        '',
        'Select Month and Year to generate report.',
        () => {},
        false,
      );
      return;
    }
    if (monthAndYear) {
      if (!premiumState) {
        PopupMessage(
          '',
          'This is premium feature, watch ad to download',
          () => {
            setLoadingAd(true);
            loadAd();
          },
        );
      } else {
        _generateCsv();
      }
    }
  };

  const _generateCsv = async () => {
    setLoadingAd(false);
    try {
      const billsData = await BillOperations.generateReportData(
        monthAndYear!,
        category,
      );
      if (billsData) {
        await buildCSV(billsData, category.length > 0 ? true : false);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    if (adDismissed) {
      console.log('Called Ad dismissed');
      dismissedCallback();
      _generateCsv();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adDismissed]);

  return (
    <View style={styles.container}>
      <Text style={styles.getReportText}>Get Report </Text>
      <PressableButton
        onPress={() => onInputPress('date')}
        style={styles.inputContainer}>
        <InputBox
          name={
            monthAndYear
              ? DayJs.formatDate(monthAndYear, '-')
              : 'Select Month & Year'
          }
        />
      </PressableButton>
      <View style={styles.marginTop}>
        <PressableButton
          style={styles.inputContainer}
          onPress={() => onInputPress('category')}>
          <InputBox name={category ? category : 'Select Category'} />
        </PressableButton>
      </View>
      <PressableButton
        onPress={GenerateCSV}
        style={styles.exportToCSVContainer}>
        <Text style={styles.exportToCSVText}> &#x25a6; Export as csv</Text>
      </PressableButton>
      <Text style={styles.noteText}>
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
      {whatVisible === 'category' && (
        <Modal
          closeModal={() => {
            setWhatVisible(undefined);
          }}
          onItemSelect={item => {
            console.log(item);
            setCategory(item.CategoryName!);
          }}
          data={categoryData}
        />
      )}
      {loadingAd && (
        <View style={styles.overlay}>
          <ActivityLoader loadingText="Loading Ad..." />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  label: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    flex: 0.8,
  },
  getReportText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
    fontWeight: '600',
    // fontFamily: GlobalStyle.Font.SemiBold,
  },
  monthText: {
    color: '#000',
    fontSize: 18,
  },
  input: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 0.4,
    borderRadius: 3,
    borderColor: '#888',
    marginHorizontal: 30,
  },
  inputContainer: {
    // marginTop: 10,
  },
  marginTop: {marginTop: 20},
  exportToCSVContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  exportToCSVText: {
    color: '#fff',
    fontSize: 18,
  },
  name: {
    fontSize: 16,
    color: '#000',
    fontFamily: GlobalStyle.Font.SemiBold,
  },
  noteText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
    textTransform: 'capitalize',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
