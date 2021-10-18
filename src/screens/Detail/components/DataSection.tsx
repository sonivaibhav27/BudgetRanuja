import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {FlatList} from 'react-native';
import {useRecoilValue} from 'recoil';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import {DetailState} from '../../../State/Atoms';
import Card from './Card';

export default () => {
  const Data = useRecoilValue(DetailState.dataForDetail);
  const navigation =
    useNavigation<StackNavigationProp<MainStackScreenType, 'Detail'>>();
  return (
    <FlatList
      data={Data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return <Card navigation={navigation} {...item} />;
      }}
    />
  );
};
