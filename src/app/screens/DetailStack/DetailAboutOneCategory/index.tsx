import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CategoryOperations, BillOperations} from '../../../../database';
import {BillTypes, NavigationTypes} from '../../../../types';
import {Loader, PressableTextButton, ViewText} from '../../../components';
import CommonStyles from '../../../styles';
import {COLORS} from '../../../theme';
import Utils from '../../../utils';
import {ListOfBills} from './components';

type Props = StackScreenProps<
  NavigationTypes.TDetailStackScreen,
  'DetailAboutOneCategory'
>;

export default (props: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [categoryData, setCategoryData] = React.useState<
    BillTypes.TBillDatabaseModel[]
  >([]);
  const [totalAmount, setTotalAmount] = React.useState(0);

  React.useEffect(() => {
    getAllDataForOneCategory();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllDataForOneCategory = async () => {
    console.log(props.route.params);
    setLoading(true);
    setError(null);
    try {
      const categoryId = Utils.findKeyByValue(
        props.route.params.categoryName,
        CategoryOperations._rawDictionary,
      );
      if (typeof categoryId === 'undefined') {
        Utils.makeToast('Something went wrong, please reload the app.');
        return;
      }
      const data = (await BillOperations.getBillsByCategoriesAndMonth(
        categoryId,
        props.route.params.monthAndYearOfBillToShow,
      )) as BillTypes.TBillDatabaseModel[];
      console.log({data});
      setCategoryData(data);
      const total = Utils.getTotalAmount(data);
      setTotalAmount(typeof total !== 'undefined' ? total : 0);
    } catch (err: any) {
      Utils.makeToast('Error while fetching record ,Please try again.');
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={CommonStyles.flex1}>
      {error === null && categoryData.length !== 0 ? (
        <>
          <ListOfBills
            currency={props.route.params.currency}
            navigation={props.navigation as any}
            data={categoryData}
          />
          <ViewText
            textType="subheading"
            textStyle={styles.tAmountText}
            viewStyle={styles.tAmountContainer}
            text={
              'Total Amount:    ' +
              props.route.params.currency +
              ' ' +
              Utils.formatIntoCurrency(totalAmount)
            }
          />
        </>
      ) : !loading ? (
        <View style={styles.errorContainer}>
          <Text style={styles.textCommon}>
            Something went failed while fetching record
          </Text>
          <Text style={styles.textCommon}>
            Error: {(error as any)?.message || 'Unknown Error'}
          </Text>
          <PressableTextButton
            text="Try Again"
            textStyle={{color: COLORS.primary}}
            style={{backgroundColor: COLORS.lightGray, marginTop: 10}}
            onPress={getAllDataForOneCategory}
          />
        </View>
      ) : (
        <Loader show={loading} loadingText="Getting Data..." />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textCommon: {
    color: '#000',
    fontSize: 16,
  },
  tAmountContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    elevation: 3,
  },
  tAmountText: {
    color: COLORS.secondry,
    fontSize: 16,
  },
});
