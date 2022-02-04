import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Theme} from '../theme&styles';
import {Icons} from '../utils';

type Props = {
  isChecked: boolean;
  name: string;
};
const SIZE = 20;
export default ({isChecked, name}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.square}>
        {isChecked && (
          <Icons.Entypo
            name="check"
            size={17}
            color={Theme.ColorsTheme.primary}
          />
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  square: {
    height: SIZE,
    width: SIZE,
    borderRadius: 2,
    borderWidth: 0.4,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    // height: SELECTED_SIZE,
    // width: SELECTED_SIZE,
    // borderRadius: SELECTED_SIZE * 2,
    // backgroundColor: Theme.ColorsTheme.primary,
  },
  name: {
    marginLeft: 10,
    color: '#000',
    fontSize: 18,
  },
});
