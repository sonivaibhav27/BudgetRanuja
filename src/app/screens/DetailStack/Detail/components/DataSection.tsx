import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {FlatList} from 'react-native';
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from 'recoil';
import {NavigationTypes} from '../../../../../types';
import {ViewText} from '../../../../components';
import {BillState, UtilState} from '../../../../state';
import CommonStyles from '../../../../styles';
import Card from './Card';

type Props = {
  monthAndYearOfBillToShow: number;
};

export default (props: Props) => {
  const setSelectedType = useSetRecoilState(
    UtilState.selectedAccordianInDetailUtilAtom,
  );
  const bills = useRecoilValue(
    BillState.groupedBasedOnCategoryByMonthSelectedBillsAtom,
  );
  const currency = useRecoilValue(UtilState.currencyUtilAtom);
  const [premium, setPremium] = React.useState(false);
  // useRecoilRefresher_UNSTABLE(DetailState.DetailDataBasedOnSelectedType);

  const getDataFromRecoil = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const isPremium = snapshot.getLoadable(
          UtilState.premiumUtilAtom,
        ).contents;
        setPremium(isPremium);
      },
    [],
  );
  React.useEffect(() => {
    setSelectedType('expense');
    getDataFromRecoil();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigation =
    useNavigation<
      StackNavigationProp<NavigationTypes.TDetailStackScreen, 'Detail'>
    >();

  return (
    <FlatList
      contentContainerStyle={CommonStyles.flex1}
      data={bills[0].length === 0 ? [] : bills[0]}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <Card
            isPremium={premium}
            currency={currency}
            monthAndYearOfBillToShow={props.monthAndYearOfBillToShow}
            navigation={navigation}
            {...(item as any)}
            billType={bills[1] || 'expense'}
          />
        );
      }}
      ListEmptyComponent={
        <ViewText text={'No Bill Found.'} viewStyle={CommonStyles.center} />
      }
    />
  );
};
