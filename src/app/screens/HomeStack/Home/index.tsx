import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, LayoutChangeEvent, Dimensions, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {BillOperations, DbUtils} from '../../../../database';
import {BillTypes, NavigationTypes} from '../../../../types';
import {Header, Loader, Text} from '../../../components';
import {DateHelper} from '../../../helper';
import {UtilState} from '../../../state';
import CommonStyles from '../../../styles';
import {COLORS} from '../../../theme';
import Utils from '../../../utils';
import {
  BudgetSection,
  BudgetExceeded,
  AddNewButton,
  Dashboard,
  BudgetInput,
  RecentTransaction,
} from './component';

interface Props {
  navigation: StackNavigationProp<
    NavigationTypes.TRootStackScreens & NavigationTypes.THomeStackScreen,
    'Home'
  >;
}
const ADD_NEW_BUTTON_HEIGHT = 65;
const MAX_CARD_HEIGHT = 60;
const SPACING = 5;

const {height} = Dimensions.get('window');
export default (props: Props) => {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const currency = useRecoilValue(UtilState.currencyUtilAtom);
  const [bottomSheetVisibile, setBottomSheetVisible] = React.useState(false);
  const [totalHeightOccupied, setTotalHeightOccupied] = React.useState(
    ADD_NEW_BUTTON_HEIGHT + 15,
  );
  const [noOfBillToBeFitted, setNoOfBillToBeFitted] = React.useState(-1);
  const [nRecords, setNRecords] = React.useState<BillTypes.TCSVBill[] | null>(
    null,
  );
  const toggleBottomSheet = () => {
    setBottomSheetVisible(prev => !prev);
  };
  const onAddNewBtnPress = () => {
    props.navigation.navigate('CreateEditScreen', {
      typeOfScreen: 'Create',
    });
  };

  const onHeaderLayout = (ev: LayoutChangeEvent) => {
    const headerAndBottomTabBarHeight =
      ev.nativeEvent.layout.height + bottomTabBarHeight;
    setTotalHeightOccupied(h => h + headerAndBottomTabBarHeight);
  };
  const onDashboardLayout = (ev: LayoutChangeEvent) => {
    const dashboardHeight = ev.nativeEvent.layout.height;
    setTotalHeightOccupied(heightOccupied => heightOccupied + dashboardHeight);
    const noOfBillsCanBeFit = Math.floor(
      (height - (totalHeightOccupied + dashboardHeight)) /
        (MAX_CARD_HEIGHT + SPACING * 2),
    );
    console.log({noOfBillsCanBeFit});
    setNoOfBillToBeFitted(noOfBillsCanBeFit);
  };

  React.useEffect(() => {
    (async () => {
      if (noOfBillToBeFitted > 0) {
        try {
          const items = await BillOperations.getNLatestRecord(
            noOfBillToBeFitted,
            DateHelper.getCurrentYearAndMonth(),
          );
          const assignCategory = DbUtils.assignCategoryName(items);
          setNRecords(assignCategory);
        } catch (e: any) {
          Utils.makeToast(
            'Error while getting recent transactions: ' + e.message,
          );
        }
      }
    })();
  }, [noOfBillToBeFitted]);

  return (
    <View style={styles.mainContainer}>
      <View style={CommonStyles.flex1}>
        <View onLayout={onHeaderLayout}>
          <Header textAlign="center" headerTitle="BudJet" />
        </View>
        <View onLayout={onDashboardLayout}>
          <BudgetExceeded />
          <BudgetSection toggleBottomSheet={toggleBottomSheet} />
          <Dashboard currency={currency} />
        </View>
        <View style={CommonStyles.flex1}>
          {nRecords != null ? (
            noOfBillToBeFitted >= 0 && (
              <View
                style={[
                  styles.recentTransactionContainer,
                  {height: height - totalHeightOccupied},
                ]}>
                <Text textType="subheading" style={{color: '#000'}}>
                  Recent Transactions
                </Text>
                <RecentTransaction
                  records={nRecords}
                  maxCardHeight={MAX_CARD_HEIGHT}
                  spacing={SPACING}
                  currency={currency}
                />
              </View>
            )
          ) : (
            <View style={CommonStyles.flex1}>
              <Loader
                backdropColor={COLORS.white}
                show={true}
                loadingText="Getting Recent Transactions"
              />
            </View>
          )}
        </View>
      </View>
      <AddNewButton
        btnHeight={ADD_NEW_BUTTON_HEIGHT}
        onPress={onAddNewBtnPress}
      />
      {bottomSheetVisibile && <BudgetInput close={toggleBottomSheet} />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  recentTransactionContainer: {
    paddingHorizontal: 20,
  },
});
