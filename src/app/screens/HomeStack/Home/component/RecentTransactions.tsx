import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {BillTypes} from '../../../../../types';
import {Text} from '../../../../components';
import {DateHelper} from '../../../../helper';
import CommonStyles from '../../../../styles';
import {COLORS, PADDING} from '../../../../theme';
import Utils from '../../../../utils';

type Props = {
  records: BillTypes.TCSVBill[];
  maxCardHeight: number;
  spacing: number;
  currency: string;
};
const {width} = Dimensions.get('window');
const RecentTransaction = (props: Props) => {
  if (props.records.length === 0) {
    return (
      <View style={CommonStyles.center}>
        <Text textType="normal">No Bills</Text>
      </View>
    );
  }
  return (
    <>
      {props.records.map((record, index) => {
        return (
          <View
            style={styles.cardContainer}
            key={record.categoryId + '-' + index}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    record.billType === 'expense'
                      ? COLORS.lightRed
                      : COLORS.lightGreen,
                  height: props.maxCardHeight,
                  marginVertical: props.spacing,
                },
              ]}>
              <View style={styles.flex1}>
                <Text
                  numberOfLines={1}
                  textType="normal"
                  style={styles.blackText}>
                  {record.categoryName}
                </Text>
                <Text style={styles.dateText} textType="paragraph">
                  {DateHelper.formatDate(record.billDate!, '/')}{' '}
                  {DateHelper.getFormatTime(record.billDate!)}
                </Text>
              </View>
              <Text textType="subheading">
                {props.currency}{' '}
                {Utils.formatIntoCurrency(record.billAmount!) || ''}
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.medium,
  },
  blackText: {
    color: COLORS.black,
    fontSize: 13,
  },
  cardContainer: {
    maxWidth: 360,
    alignSelf: 'center',
    width: width * 0.85,
  },
  flex1: {flex: 1, flexDirection: 'column', marginRight: 15},
  dateText: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
});
export default RecentTransaction;
