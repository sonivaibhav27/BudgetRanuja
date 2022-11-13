import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PressableTextButton, Text} from '../../../../components';
import {CommonOperations} from '../../../../../database';
import {COLORS, PADDING} from '../../../../theme';

const DeleteButtonText = [
  {visibleName: 'Last Month', code: 'last_month'},
  {visibleName: 'Last 3 Month', code: 'last_3_month'},
  {visibleName: 'Last 6 Month', code: 'last_6_month'},
  {visibleName: 'Last Year', code: 'last_year'},
  // {visibleName: 'Delete All', code: 'delete_all'},
];
export default () => {
  const deleteBill = (code: string) => {
    CommonOperations.DeleteBills(code as any);
  };
  return (
    <View>
      {DeleteButtonText.map(deleteText => {
        return (
          <PressableTextButton
            textStyle={styles.deleteButtonTextStyle}
            text={deleteText.visibleName}
            onPress={() => deleteBill(deleteText.code)}
            key={deleteText.code}
            style={styles.buttonStyle}
            textType="subheading"
          />
        );
      })}
      <Text textType="paragraph" style={styles.note}>
        Note: Once Deleted , Data can't be recovered later.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    padding: PADDING.big,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: COLORS.lightGray,
  },
  deleteButtonTextStyle: {
    color: COLORS.red,
    fontSize: 18,
  },
  note: {
    marginTop: 20,
    color: COLORS.darkGray,
    textAlign: 'center',
    fontSize: 13,
  },
});
