import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PressableButton} from '../../../common';
import {CategoriesColors} from '../../../data';

const COLOR_DOT = 24;

type Props = {
  selectedColor: string;
  onColorPickerPress: (color: string) => void;
};

export default (props: Props) => {
  return (
    <View style={styles.container}>
      {CategoriesColors.map((color, index) => {
        return (
          <PressableButton
            key={`${color}-${index}`}
            hitSlop={{top: 3, left: 3, right: 4}}
            onPress={() => props.onColorPickerPress(color)}
            style={[styles.default]}>
            <View
              key={color}
              style={[styles.colorDot, {backgroundColor: color}]}
            />
          </PressableButton>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  colorDot: {
    height: COLOR_DOT,
    width: COLOR_DOT,
    borderRadius: 4,
  },
  selected: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 100,
    borderColor: '#666',
    alignItems: 'center',
  },
  default: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
