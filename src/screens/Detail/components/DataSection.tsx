import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import {DetailState} from '../../../State/Atoms';
import {Logger} from '../../../utils';
import Card from './Card';

export default () => {
  const Data = useRecoilValue(DetailState.dataForDetail);
  Logger.consoleLog(Data, 'log');
  const navigation =
    useNavigation<StackNavigationProp<MainStackScreenType, 'Detail'>>();
  return (
    <FlatList
      data={Data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return <Card navigation={navigation} {...item} />;
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nothing to show :)</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#000',
  },
});
