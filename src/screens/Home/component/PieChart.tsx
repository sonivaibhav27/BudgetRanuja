import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import Svg, {Text as SvgText} from 'react-native-svg';
import {VictoryContainer, VictoryLabel, VictoryPie} from 'victory-native';
import {DetailState} from '../../../State/Atoms';
import {GroupByCategories, Logger} from '../../../utils';
import {ModelTypes} from '../../../database';

function shuffleArray(array: ModelTypes.BudgetTypes[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default () => {
  const {height, width} = useWindowDimensions();
  const expenseBills = useRecoilValue(DetailState.ExpensesAtom);
  if (expenseBills != null) {
    const expenseAfterGrouped = React.useMemo(() => {
      return GroupByCategories(expenseBills);
    }, [expenseBills]);
    Logger.consoleLog(shuffleArray(expenseAfterGrouped), 'warn');
    const sumOfExpenses: number = expenseAfterGrouped.reduce((prev, curr) => {
      return prev + curr.billAmount!;
    }, 0);
    const dataToShowInPieChart = shuffleArray(expenseAfterGrouped).map(bill => {
      return {
        x: bill.billCategory,
        y: bill.billAmount! / sumOfExpenses,
        fill: bill.fill,
      };
    });
    return (
      <View style={styles.container}>
        <VictoryPie
          data={dataToShowInPieChart}
          padAngle={2}
          height={height * 0.5}
          style={{
            labels: {
              fontSize: 10,
            },
            parent: {
              overflow: 'visible',
            },
          }}
          innerRadius={80}
          labelComponent={
            <VictoryLabel
              angle={arg => {
                return `${(arg.index + 0.5) * -15}`;
              }}
              style={{fontSize: 9}}
            />
          }
        />
        <Text
          style={{
            position: 'absolute',
            textAlign: 'center',
            width: 100,
          }}>
          Actual Left
        </Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
