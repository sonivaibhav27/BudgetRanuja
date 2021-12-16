import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useRecoilValue} from 'recoil';
import {UtilsAtom} from '../../../State';
import {Icons} from '../../../utils';

interface Props {
  backgroundColor: string;
  borderColor: string;
  text: 'income' | 'expense';
  totalAmount: string;
  onPress: (comingFrom: 'income' | 'expense') => void;
}

export default (props: Props) => {
  const {height} = useWindowDimensions();
  const currency = useRecoilValue(UtilsAtom.Currency);
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
          paddingVertical: (height - height * 0.8) * 0.18 - 5,
        },
      ]}>
      <View style={styles.flex}>
        <View>
          <Text style={[{color: props.borderColor}, styles.titleText]}>
            {props.text}
          </Text>
        </View>
        <View>
          <Text style={styles.currency}>
            {currency}
            <Text
              numberOfLines={2}
              style={[{color: props.borderColor}, styles.amountText]}>
              {props.totalAmount}
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.chevronRightContainer,
          {
            backgroundColor: props.backgroundColor,
            padding: height * 0.2 * 0.07,
          },
        ]}>
        <Icons.Entypo name="plus" size={height * 0.2 * 0.15} color="#000" />
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
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    // elevation: 1,
    flexDirection: 'row',
  },
  titleText: {
    fontWeight: '700',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  amountText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14,
  },
  chevronRightContainer: {
    borderRadius: 100,
  },
  flex: {
    flex: 1,
  },
  currency: {
    fontSize: 12,
    color: '#000',
    fontWeight: '900',
  },
});
