import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {useRecoilCallback} from 'recoil';
import {VictoryPie} from 'victory-native';
import {ActivityLoader} from '../../common';
import {BillsAtom, UtilsAtom} from '../../State/Atoms';
import {OnlyInformationFromBillType} from '../../types';
import {GroupByCategories, Miscellaneous} from '../../utils';

export default () => {
  const {height} = useWindowDimensions();
  const [pieChartData, setPieChartData] = React.useState<
    OnlyInformationFromBillType[]
  >([]);
  const [currency, setCurrency] = React.useState('$');

  const PieChartData = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const data = snapshot.getLoadable(
          BillsAtom.CurrentMonthExpenseBills,
        ).contents;
        const currencyFromRecoil = snapshot.getLoadable(
          UtilsAtom.Currency,
        ).contents;
        setPieChartData(data);
        setCurrency(currencyFromRecoil);
      },
    [],
  );
  React.useEffect(() => {
    PieChartData();
  }, [PieChartData]);

  // return null;
  if (pieChartData !== null) {
    const expenseAfterGrouped = React.useMemo(() => {
      return GroupByCategories(pieChartData);
    }, [pieChartData]);

    if (expenseAfterGrouped == null) {
      return null;
    }
    const sumOfExpenses: number = expenseAfterGrouped.reduce((prev, curr) => {
      return prev + curr.billAmount!;
    }, 0);
    const dataToShowInPieChart = expenseAfterGrouped.map(bill => {
      return {
        percentage: `${((bill.billAmount! / sumOfExpenses) * 100).toFixed(2)}%`,
        y: bill.billAmount! / sumOfExpenses,
        billCategory: bill.billCategory,
        total: bill.billAmount,
        fill: bill.categoryColor,
      };
    });

    return (
      <ScrollView style={styles.container}>
        <VictoryPie
          x="percentage"
          style={{
            labels: {
              // display: 'none',
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
          labelPlacement={({index}) => (index ? 'parallel' : 'perpendicular')}
        />
        <View style={styles.billCategoryContainer}>
          <Text style={styles.title}>Expense Categories</Text>
          {dataToShowInPieChart.map((pieData, index) => {
            return (
              <View
                key={pieData.billCategory + `${index}`}
                style={styles.pieDataContainer}>
                <View style={styles.colorDotAndTitleContainer}>
                  <View
                    style={[styles.colorDot, {backgroundColor: pieData.fill}]}
                  />
                  <Text style={styles.billCategory}>
                    {pieData.billCategory}
                  </Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text
                    textBreakStrategy="highQuality"
                    style={styles.totalCategoryAmount}>
                    {currency}
                    {Miscellaneous.formatIntoCurrency(pieData.total)}
                  </Text>
                  <Text style={[styles.percentage, {color: pieData.fill}]}>
                    {pieData.percentage}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.valueContainer}>
        <ActivityLoader />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {fontWeight: 'bold', color: '#000', fontSize: 22, marginBottom: 20},
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
  percentage: {
    color: '#000',
    fontWeight: '800',
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
