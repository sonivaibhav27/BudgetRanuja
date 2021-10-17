import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import Button from './Button';

interface Props {
  navigation: StackNavigationProp<MainStackScreenType, 'Home'>;
}

export default ({navigation}: Props) => {
  const navigateToCreateScreen = (comingFrom: 'income' | 'expense') => {
    navigation.navigate('Create', {
      comingFrom: comingFrom,
    });
  };

  return (
    <>
      <Button
        backgroundColor="#e4f7e6"
        borderColor="#40c94f"
        text="income"
        totalAmount={3000}
        onPress={navigateToCreateScreen}
      />
      <Button
        backgroundColor="#fceceb"
        borderColor="red"
        // borderColor={currentTheme.expense.borderColor}
        text="expense"
        totalAmount={3500}
        onPress={navigateToCreateScreen}
      />
    </>
  );
};
