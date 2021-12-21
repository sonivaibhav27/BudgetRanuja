import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {PressableButton} from '../../../common';
import {CommonOperations} from '../../../database';
import {Theme} from '../../../theme&styles';

const DeleteButtonText = [
  'Last Month',
  'Last 3 Month',
  'Last 6 Month',
  'Last Year',
  // 'Delete All',
];
export default () => {
  const deleteBill = (deleteText: string) => {
    switch (deleteText) {
      case DeleteButtonText[0]:
        CommonOperations.DeleteBills('last_month');
        break;
      case DeleteButtonText[1]:
        CommonOperations.DeleteBills('last_3_month');
        break;
      case DeleteButtonText[2]:
        CommonOperations.DeleteBills('last_6_month');
        break;
      case DeleteButtonText[3]:
        CommonOperations.DeleteBills('last_year');
        break;
      case DeleteButtonText[4]:
        CommonOperations.DeleteBills('delete_all');
        break;
      default:
        break;
    }
  };
  return (
    <View>
      {DeleteButtonText.map(deleteText => {
        return (
          <PressableButton
            onPress={() => deleteBill(deleteText)}
            key={deleteText}
            style={styles.buttonStyle}>
            <Text style={styles.buttonText}>{deleteText}</Text>
          </PressableButton>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Theme.ColorsTheme.expense.borderColor,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
