import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icons} from '../../../utils';

interface Props {
  backgroundColor: string;
  borderColor: string;
  text: 'income' | 'expense';
  totalAmount: number;
  onPress: (comingFrom: 'income' | 'expense') => void;
}

export default (props: Props) => {
  const _navigateToCreateScreen = () => {
    props.onPress(props.text);
  };
  return (
    <Pressable
      onPress={_navigateToCreateScreen}
      style={[
        styles.container,
        {
          // backgroundColor: props.backgroundColor,
          borderColor: props.borderColor,
        },
      ]}>
      <View>
        <View>
          <Text style={[{color: props.borderColor}, styles.titleText]}>
            {props.text}
          </Text>
        </View>
        <View>
          <Text style={[{color: props.borderColor}, styles.amountText]}>
            ${props.totalAmount}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.chevronRightContainer,
          {backgroundColor: props.backgroundColor},
        ]}>
        <Icons.Entypo name="plus" size={20} color="#000" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    // elevation: 1,
    flexDirection: 'row',
    paddingVertical: 20,
  },
  titleText: {
    fontWeight: '700',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  amountText: {
    fontWeight: 'bold',
    color: '#000',
  },
  chevronRightContainer: {
    padding: 10,
    borderRadius: 100,
  },
});
