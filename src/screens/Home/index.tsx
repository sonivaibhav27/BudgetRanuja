import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {
  Header,
  BudgetSection,
  PieChart,
  ActionButtons,
  DetailButton,
} from './component';

interface Props {
  navigation: StackNavigationProp<MainStackScreenType, 'Home'>;
}

export default ({navigation}: Props) => {
  const {height} = useWindowDimensions();

  const navigateToDetailScreen = () => {
    navigation.navigate('Detail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <View style={[styles.budgetSection, {height: height * 0.1}]}>
        <BudgetSection />
      </View>
      <View style={styles.pieChart}>
        <PieChart />
      </View>
      <View style={[styles.actionButton]}>
        <ActionButtons navigation={navigation} />
      </View>
      <View>
        <DetailButton onPress={navigateToDetailScreen} />
      </View>
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
    padding: 8,
  },
  budgetSection: {
    marginBottom: 10,
    // backgroundColor: 'yellow',
  },
  actionButton: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  pieChart: {
    marginTop: 10,
    flex: 1,
  },
});
