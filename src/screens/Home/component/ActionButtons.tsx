import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import Button from './Button';
import {useRecoilValue} from 'recoil';
import {BillsAtom} from '../../../State/Atoms';
import {Miscellaneous} from '../../../utils';

interface Props {
  navigation: StackNavigationProp<MainStackScreenType, 'Home'>;
}

export default ({navigation}: Props) => {
  const currentMonthAuditDetail = useRecoilValue(
    BillsAtom.CurrentMonthAuditDetail,
  );
  const navigateToCreateScreen = (comingFrom: 'income' | 'expense') => {
    navigation.navigate('Create', {
      comingFrom: comingFrom,
      screenType: 'Create',
    });
  };

  return (
    <>
      <Button
        backgroundColor="#e4f7e6"
        borderColor="#40c94f"
        text="income"
        totalAmount={Miscellaneous.formatIntoCurrency(
          currentMonthAuditDetail.incomeTotal,
        )}
        onPress={navigateToCreateScreen}
      />
      <Button
        backgroundColor="#fceceb"
        borderColor="red"
        // borderColor={currentTheme.expense.borderColor}
        text="expense"
        totalAmount={Miscellaneous.formatIntoCurrency(
          currentMonthAuditDetail.expenseTotal,
        )}
        onPress={navigateToCreateScreen}
      />
    </>
  );
};
