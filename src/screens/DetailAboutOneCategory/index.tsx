import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Text, View} from 'react-native';
import {MainStackScreenType} from '../../navigations/MainStack/types';

type Props = StackScreenProps<MainStackScreenType, 'DetailAboutOneCategory'>;
export default (props: Props) => {
  return (
    <View>
      <Text>Datail in Detail ;) {props.route.params.categoryName}</Text>
    </View>
  );
};
