import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {BottomSheet} from '../../common';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {
  Header,
  BudgetSection,
  PieChart,
  ActionButtons,
  DetailButton,
  BudgetExceeded,
} from './component';

interface Props {
  navigation: StackNavigationProp<MainStackScreenType, 'Home'>;
}

export default ({navigation}: Props) => {
  const {height} = useWindowDimensions();
  const [bottomSheetVisibile, setBottomSheetVisible] = React.useState(false);

  const navigateToDetailScreen = () => {
    navigation.navigate('Detail');
  };

  const toggleBottomSheet = () => {
    setBottomSheetVisible(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={{height: height * 0.2}}>
        <View style={styles.header}>
          <Header />
        </View>
        <View style={[styles.budgetSection]}>
          <BudgetExceeded />
          <BudgetSection toggleBottomSheet={toggleBottomSheet} />
        </View>
      </View>
      <View style={[styles.pieChart, {height: height * 0.6}]}>
        <PieChart />
      </View>
      <View style={{height: height * 0.2, justifyContent: 'space-between'}}>
        <View style={[styles.actionButton]}>
          <ActionButtons navigation={navigation} />
        </View>
        <View>
          <DetailButton onPress={navigateToDetailScreen} />
        </View>
      </View>

      {bottomSheetVisibile && (
        <BottomSheet closeBottomSheet={toggleBottomSheet} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  header: {
    // backgroundColor: 'red',
    paddingVertical: 4,
  },
  budgetSection: {
    marginBottom: 10,
    // backgroundColor: 'yellow',
  },
  actionButton: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 5,
  },
  pieChart: {
    flex: 2.5,
  },
});
