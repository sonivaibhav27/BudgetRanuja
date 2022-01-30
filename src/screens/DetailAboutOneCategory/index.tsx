import {GoogleAdsTypes} from '@invertase/react-native-google-ads';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ActivityLoader, PressableButton} from '../../common';
import {BillOperations} from '../../database';
import {loadRewardAd} from '../../hooks';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {Theme} from '../../theme&styles';
import {ExtraDetailTypes, TCSVBills} from '../../types';
import {buildCSV, Miscellaneous, PopupMessage, Toast} from '../../utils';
import {ListOfBills, TotalSection} from './components';

type Props = StackScreenProps<MainStackScreenType, 'DetailAboutOneCategory'>;

export default (props: Props) => {
  const [loadAd, adEventHandler, rewardedInstance] = loadRewardAd();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [categoryData, setCategoryData] = React.useState<
    ExtraDetailTypes.DataProp[]
  >([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [loadingAd, setLoadingAd] = React.useState(false);
  const watchAdRef = React.useRef<boolean>(false);

  const adRewardedRef =
    React.useRef<GoogleAdsTypes.RewardedAd>(rewardedInstance);

  React.useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onGenerateReportButtonPressed}
            style={styles.exportToCSVContainer}>
            <Text style={styles.exportToCSVText}> &#x25a6; Export as csv</Text>
          </TouchableOpacity>
        );
      },
    });

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData, props.navigation]);

  React.useEffect(() => {
    const event = adEventHandler(
      adRewardedRef.current,
      onSuccessAdWatchedCallback,
      () => {
        setLoadingAd(false);
      },
      onAdClosed,
      () => {
        watchAdRef.current = false;
        downloadCSV();
      },
    );
    return () => event();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData]);
  React.useEffect(() => {
    getAllDataForOneCategory();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadCSV = async () => {
    console.log({
      categoryData,
    });
    if (categoryData.length > 0) {
      const csv: TCSVBills[] = categoryData.map(item => {
        return {
          ...item,
          categoryName: props.route.params.categoryName,
          billType: props.route.params.billType as 'expense' | 'income',
        };
      });
      await buildCSV(csv, true);
      watchAdRef.current = false;
    }
  };
  const onAdClosed = async () => {
    if (watchAdRef.current) {
      await downloadCSV();
    }
  };
  const onSuccessAdWatchedCallback = () => {
    watchAdRef.current = true;
  };
  const onGenerateReportButtonPressed = async () => {
    PopupMessage(
      '',
      'This is premium feature, Watch ads to see the bill in detail',
      () => {
        loadAd(adRewardedRef.current);
      },
    );
  };
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
      {loadingAd && (
        <View style={styles.overlayCenter}>
          <ActivityLoader loadingText="loading ad..." />
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

  exportToCSVContainer: {
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 100,
  },
  exportToCSVText: {
    color: '#fff',
  },
  overlayCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
