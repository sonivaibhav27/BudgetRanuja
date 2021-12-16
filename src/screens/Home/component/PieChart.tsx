import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {VictoryContainer, VictoryPie} from 'victory-native';
import {BillsAtom} from '../../../State/Atoms';
import {GroupByCategories, Icons} from '../../../utils';
import {PressableButton} from '../../../common';
import {MainStackScreenType} from '../../../navigations/MainStack/types';

export default () => {
  const navigation =
    useNavigation<NavigationProp<MainStackScreenType, 'Home'>>();
  const {height} = useWindowDimensions();
  const expenseBills = useRecoilValue(BillsAtom.CurrentMonthExpenseBills);
  const expenseAfterGrouped = React.useMemo(() => {
    return GroupByCategories(expenseBills);
  }, [expenseBills]);
  console.log({expenseBills});
  if (expenseBills != null && expenseBills.length > 0) {
    console.log({expenseAfterGrouped});
    if (expenseAfterGrouped == null) {
      return null;
    }

    const sumOfExpenses: number = expenseAfterGrouped.reduce((prev, curr) => {
      return prev + curr.billAmount!;
    }, 0);
    const dataToShowInPieChart = expenseAfterGrouped.map(bill => {
      return {
        x: `${((bill.billAmount! / sumOfExpenses) * 100).toFixed(2)}%`,
        y: bill.billAmount! / sumOfExpenses,
        fill: bill.categoryColor,
      };
    });

    const onGraphShowInDetailPress = () => {
      navigation.navigate('PieChart');
    };
    return (
      <View style={styles.container}>
        <VictoryPie
          // disableInlineStyles
          style={{
            labels: {fill: '#fff', fontSize: 12, fontWeight: 'bold'},
            parent: {
              zIndex: -1,
              padding: 0,
              // backgroundColor: 'red',
            },
            data: {
              fill: ({datum}) => datum.fill,
            },
          }}
          radius={height * 0.18}
          data={dataToShowInPieChart}
          padAngle={0.5}
          height={height * 0.4}
          labelPlacement={({index}) => (index ? 'parallel' : 'perpendicular')}
          containerComponent={<VictoryContainer responsive={true} />}
          innerRadius={height * 0.08}
          labelRadius={({innerRadius}) => 6 + +innerRadius!}
        />

        <View style={{}}>
          <PressableButton
            onPress={onGraphShowInDetailPress}
            style={styles.graphInDetailButtonContainer}>
            <Text style={styles.graphInDetailButtonText}>
              Show graph in detail <Icons.AntDesign name="arrowright" />{' '}
            </Text>
          </PressableButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.emptyData, {height: height * 0.3, width: height * 0.3}]}
      />
      <Text style={styles.emptyDataText}>
        create expense bills to show chart
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100%',
    marginTop: 10,
    // backgroundColor: 'red',
    flex: 1,
    // backgroundColor: 'red',
  },
  graphInDetailButtonContainer: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
  },
  graphInDetailButtonText: {
    color: '#000',
  },
  emptyData: {
    backgroundColor: '#FFF',
    borderRadius: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDataText: {
    backgroundColor: '#ccc',
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    padding: 8,
    fontWeight: '500',
    fontSize: 15,
    borderRadius: 8,
  },
});
