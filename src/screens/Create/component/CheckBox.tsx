import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Theme} from '../../../theme&styles';
import {Icons} from '../../../utils';

type Props = {
  isChecked: boolean;
};

export default ({isChecked}: Props) => {
  return (
    <View style={[styles.container, isChecked && styles.checkedContainer]}>
      {isChecked && <Icons.Entypo name="check" size={15} color="#fff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 2,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedContainer: {
    backgroundColor: Theme.ColorsTheme.primary,
    borderWidth: 0,
  },
});
