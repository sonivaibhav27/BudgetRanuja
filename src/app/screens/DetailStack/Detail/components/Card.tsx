import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {NavigationTypes} from '../../../../../types';
import {Pressable, Text} from '../../../../components';
import {Icons} from '../../../../helper';
import Utils from '../../../../utils';

interface CardProps {
  typeOfBill?: string;
  billAmount?: number;
  billCategory?: string;
  navigation: StackNavigationProp<NavigationTypes.TDetailStackScreen, 'Detail'>;
  monthAndYearOfBillToShow: number;
  billType?: 'income' | 'expense';
  currency: string;
  isPremium: boolean;
}

export default (props: CardProps) => {
  const navigateToDetailAboutOneCategory = () => {
    props.navigation.navigate('DetailAboutOneCategory', {
      categoryName: props.billCategory!,
      monthAndYearOfBillToShow: props.monthAndYearOfBillToShow,
      billType: props.billType!,
      currency: props.currency,
    });
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={navigateToDetailAboutOneCategory}
        style={styles.container}>
        <View style={styles.categoryContainer}>
          <Text textType="normal" style={styles.categoryText}>
            {props.billCategory!}
          </Text>
        </View>
        <View style={styles.amountAndArrowContainer}>
          <Text textType="heading" style={styles.amount}>
            {`${props.currency} ${Utils.formatIntoCurrency(props.billAmount!)}`}
          </Text>
          <View style={styles.arrowContainer}>
            <Icons.AntDesign size={15} name="arrowright" color="#000" />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
  },
  container: {
    padding: 10,
    // elevation: 1,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 6,
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowOffset: {width: 3, height: 3},
        shadowRadius: 1,
        shadowColor: '#EEE',
        shadowOpacity: 1,
      },
    }),

    // borderBottomWidth: 2,
    // borderBottomColor: COLORS.secondry,
  },
  categoryText: {
    fontSize: 16,
    color: '#222',
  },
  amount: {
    fontSize: 16,
    color: '#000',
  },
  categoryContainer: {
    flex: 1,
  },
  amountAndArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowContainer: {
    backgroundColor: 'rgba(163,94,0,0.07)',
    padding: 4,
    borderRadius: 50,
    marginLeft: 5,
  },
});
