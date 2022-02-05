import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {FlatList} from 'react-native';
import {
  useRecoilCallback,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import {DetailState, UtilsAtom} from '../../../State/Atoms';
import Card from './Card';
import EmptyScreen from './Empty';

type Props = {
  monthAndYearOfBillToShow: number;
  loadAd: () => void;
  selectedCardForAd: any;
};

export default (props: Props) => {
  const setSelectedType = useSetRecoilState(DetailState.selectedType);
  const bills = useRecoilValue(DetailState.DetailDataBasedOnSelectedType);
  const currency = useRecoilValue(UtilsAtom.Currency);
  const [premium, setPremium] = React.useState(false);
  useRecoilRefresher_UNSTABLE(DetailState.DetailDataBasedOnSelectedType);

  const getDataFromRecoil = useRecoilCallback(({snapshot}) => () => {
    const isPremium = snapshot.getLoadable(UtilsAtom.PremiumUser).contents;
    setPremium(isPremium);
  });
  React.useEffect(() => {
    setSelectedType('expense');
    getDataFromRecoil();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigation =
    useNavigation<StackNavigationProp<MainStackScreenType, 'Detail'>>();

  return (
    <FlatList
      contentContainerStyle={{flex: 1}}
      data={bills[0].length === 0 ? [] : bills[0]}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <Card
            isPremium={premium}
            selectedCardForAd={props.selectedCardForAd}
            loadAd={props.loadAd}
            currency={currency}
            monthAndYearOfBillToShow={props.monthAndYearOfBillToShow}
            navigation={navigation}
            {...item}
            billType={bills[1] || 'expense'}
          />
        );
      }}
      ListEmptyComponent={<EmptyScreen />}
    />
  );
};
