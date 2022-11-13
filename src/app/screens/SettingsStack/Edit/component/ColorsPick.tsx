import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Data} from '../../../../assets';
import {Pressable} from '../../../../components';

const COLOR_DOT = 24;

type Props = {
  selectedColor: string;
  onColorPickerPress: (color: string) => void;
};

export default (props: Props) => {
  return (
    <View style={styles.container}>
      {Data.CategoriesColors.map((color, index) => {
        return (
          <Pressable
            key={`${color}-${index}`}
            onPress={() => props.onColorPickerPress(color)}
            style={[styles.default]}>
            <View
              key={color}
              style={[styles.colorDot, {backgroundColor: color}]}
            />
          </Pressable>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDot: {
    height: COLOR_DOT,
    width: COLOR_DOT,
    borderRadius: 4,
  },
  default: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
