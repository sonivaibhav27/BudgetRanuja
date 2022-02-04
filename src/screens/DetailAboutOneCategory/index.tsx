import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ActivityLoader, PressableButton} from '../../common';
import {BillOperations} from '../../database';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {Theme} from '../../theme&styles';
import {ExtraDetailTypes} from '../../types';
import {Miscellaneous, Toast} from '../../utils';
import {ListOfBills, TotalSection} from './components';

type Props = StackScreenProps<MainStackScreenType, 'DetailAboutOneCategory'>;

export default (props: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [categoryData, setCategoryData] = React.useState<
    ExtraDetailTypes.DataProp[]
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
      // throw new Error('new');
      const categoryId = Miscellaneous.findKeyByValue(
        props.route.params.categoryName,
      );
      if (typeof categoryId === 'undefined') {
        Toast('Something went wrong, please reload the app.');
        return;
      }
      const data = (await BillOperations.getBillsByCategoriesAndMonth(
        categoryId,
        props.route.params.monthAndYearOfBillToShow,
      )) as ExtraDetailTypes.DataProp[];
      setCategoryData(data);

      const total = data?.reduce((prev, curr) => prev + curr.billAmount!, 0);
      setTotalAmount(typeof total !== 'undefined' ? total : 0);
    } catch (err) {
      Toast('Error while fetching record ,Please try again.');
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityLoader />
      </View>
    );
  }
  return (
    <View style={styles.flex}>
      {error === null ? (
        <>
          <ListOfBills
            currency={props.route.params.currency}
            navigation={props.navigation}
            data={categoryData}
          />
          <TotalSection amount={totalAmount} />
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.textCommon}>
            Something went failed while fetching record
          </Text>
          <Text style={styles.textCommon}>
            Error: {error!['message'] || 'Unknown Error'}
          </Text>
          <PressableButton onPress={getAllDataForOneCategory}>
            <Text style={styles.tryAgainText}>Try Again.</Text>
          </PressableButton>
        </View>
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
  tryAgainText: {
    color: Theme.ColorsTheme.primary,
    fontSize: 18,
    fontWeight: '500',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  flex: {flex: 1},
  container: {
    padding: 10,
    marginHorizontal: 20,
    flex: 1,
  },
});
