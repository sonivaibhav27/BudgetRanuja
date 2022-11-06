import React from 'react';
import {View, StyleSheet, useWindowDimensions, ScrollView} from 'react-native';
import {useRecoilValue} from 'recoil';
import {VictoryPie} from 'victory-native';
import {DbUtils} from '../../../../database';
import {Header, Text} from '../../../components';
import {BillState, UtilState} from '../../../state';
import CommonStyles from '../../../styles';
import Utils from '../../../utils';
import {EmptyScreen} from './components';

export default () => {
  const {height} = useWindowDimensions();
  const currentMonthExpenseBillsAtom = useRecoilValue(
    BillState.currentMonthExpenseBillsAtom,
  );
  const currency = useRecoilValue(UtilState.currencyUtilAtom);
  const expenseAfterGroupedByCategory = DbUtils.groupBillsByCategory(
    currentMonthExpenseBillsAtom,
  );
  const sumOfExpenses = Utils.getTotalAmount(
    expenseAfterGroupedByCategory as any,
  );
  const dataToShowInPieChart = expenseAfterGroupedByCategory.map(bill => {
    return {
      percentage: `${((bill.billAmount! / sumOfExpenses) * 100).toFixed(2)}%`,
      y: bill.billAmount! / sumOfExpenses,
      billCategory: bill.billCategory,
      total: bill.billAmount,
      fill: bill.categoryColor,
    };
  });

  return (
    <View style={CommonStyles.flex1}>
      <Header textAlign="left" headerTitle="Chart" textType="heading" />
      {currentMonthExpenseBillsAtom.length === 0 ? (
        <EmptyScreen />
      ) : (
        <ScrollView style={CommonStyles.screenContainer}>
          <VictoryPie
            x="percentage"
            style={{
              labels: {
                display: 'none',
              },
              data: {
                fill: ({datum}) => datum.fill,
              },
            }}
            data={dataToShowInPieChart}
            padAngle={0.5}
            height={height * 0.5}
            radius={height * 0.18}
            labelRadius={({innerRadius, radius}) =>
              (radius as number) + ((innerRadius as number) || 0)
            }
            // labelPlacement={({index}: any) =>
            //   index ? 'parallel' : 'perpendicular'
            // }
          />
          <View style={styles.billCategoryContainer}>
            <Text textType="subheading" style={styles.title}>
              Expense Categories
            </Text>
            {dataToShowInPieChart.map((pieData, index) => {
              return (
                <View
                  key={pieData.billCategory + `${index}`}
                  style={styles.pieDataContainer}>
                  <View style={styles.colorDotAndTitleContainer}>
                    <View
                      style={[styles.colorDot, {backgroundColor: pieData.fill}]}
                    />
                    <Text textType="normal" style={styles.billCategory}>
                      {pieData.billCategory}
                    </Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text textType="normal" style={styles.totalCategoryAmount}>
                      {`${currency} ${Utils.formatIntoCurrency(pieData.total)}`}
                    </Text>
                    <Text textType="subheading" style={{color: pieData.fill}}>
                      {pieData.percentage}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  billCategoryContainer: {
    padding: 10,
  },
  billCategory: {
    color: '#222',
    fontWeight: '600',
    fontSize: 18,
    padding: 4,
  },
  pieDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalCategoryAmount: {
    color: '#000',
    fontWeight: '600',
    marginRight: 10,
    // backgroundColor: 'red',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
  colorDotAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
