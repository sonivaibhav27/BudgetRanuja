import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, View, Platform, Pressable} from 'react-native';
import {MainStackScreenType} from '../../../navigations/MainStack/types';

interface CardProps {
  category: string;
  amount: number;
  date: Date;
  navigation: StackNavigationProp<MainStackScreenType, 'Detail'>;
}

export default (props: CardProps) => {
  const navigateToDetailAboutOneCategory = () => {
    props.navigation.navigate('DetailAboutOneCategory', {
      categoryName: props.category,
    });
  };
  return (
    <Pressable
      onPress={navigateToDetailAboutOneCategory}
      style={styles.container}>
      <View>
        <Text style={styles.categoryText}>{props.category}</Text>
      </View>
      <Text style={styles.amount}>{props.amount}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // elevation: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOffset: {width: 3, height: 3},
        shadowRadius: 1,
        shadowColor: '#EEE',
        shadowOpacity: 1,
      },
    }),
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  amount: {
    fontSize: 16,
    color: '#000',
  },
});
