import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CategoriesTypes} from '../../../types';
import {COLORS} from '../../theme';
import {Pressable, Text} from '../atoms';

const Item = ({
  item,
  onPress,
}: {
  item: CategoriesTypes.TCategories;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.itemContainer}>
      <Text textType="normal" style={styles.text}>
        {item.CategoryName!}
      </Text>
      <View
        style={[
          styles.code,
          {backgroundColor: item.CategoryColorCode && item.CategoryColorCode},
        ]}
      />
    </Pressable>
  );
};

interface CategoriesDisplayProps {
  categories: CategoriesTypes.TCategories[];
  onItemPress: (category: CategoriesTypes.TCategories) => void;
  title: string;
}

const CategoriesDisplay = (props: CategoriesDisplayProps) => {
  if (props.categories.length === 0) return null;
  return (
    <>
      <Text style={styles.headerTxt} textType="normal">
        {props.title}
      </Text>
      {props.categories.map((category, idx) => {
        return (
          <Item
            onPress={() => props.onItemPress(category)}
            key={category.CategoryId || idx.toString()}
            item={category}
          />
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  code: {
    width: 13,
    height: 13,
    borderRadius: 10,
  },
  headerTxt: {
    color: COLORS.secondry,
    paddingLeft: 20,
    fontSize: 14,
    marginTop: 10,
  },
});

export default CategoriesDisplay;
