import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {useRecoilCallback} from 'recoil';
import {PressableButton} from '../../../common';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import {CategoriesAtom} from '../../../State/Atoms';
import {Theme} from '../../../theme&styles';
import {TCategoryType} from '../../../types';

interface Props {
  navigation: StackNavigationProp<MainStackScreenType, 'Settings'>;
}
export default ({navigation}: Props) => {
  const [categories, setCategories] = React.useState<TCategoryType[]>([]);
  const getCategoriesFromRecoil = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const getCategories: TCategoryType[] = snapshot.getLoadable(
          CategoriesAtom.AllCategories,
        ).contents;
        setCategories(
          getCategories.filter(category => category.IsDeleted! === 0),
        );
      },
    [],
  );
  React.useEffect(() => {
    getCategoriesFromRecoil();
  }, [getCategoriesFromRecoil]);
  const navigateToEditCategoy = (item: TCategoryType) => {
    navigation.navigate('EditCategory', {
      categoryId: item.CategoryId!,
      categoryName: item.CategoryName!,
      categoryType: item.CategoryType!,
      allCategories: categories,
      comingFrom: 'Category',
      categoryColor: item.CategoryColorCode,
    });
  };

  const goToNewCategory = () => {
    navigation.navigate('EditCategory', {
      comingFrom: 'Category',
      type: 'New',
    });
  };

  const renderItem = ({item}: {item: TCategoryType}) => {
    return (
      <PressableButton
        onPress={() => navigateToEditCategoy(item)}
        style={styles.itemContainer}>
        <Text style={styles.text}>{item.CategoryName}</Text>
        <View
          style={[
            styles.code,
            {backgroundColor: item.CategoryColorCode && item.CategoryColorCode},
          ]}
        />
      </PressableButton>
    );
  };
  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item, index) => `${item.CategoryId}-${index}`}
      data={categories}
      renderItem={renderItem}
      ListFooterComponent={
        <PressableButton
          onPress={goToNewCategory}
          style={styles.newCategoryContainer}>
          <Text style={styles.newCategoryText}>Enter new category.</Text>
        </PressableButton>
      }
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
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
  separator: {borderBottomWidth: 1, borderBottomColor: '#e7e7e7'},
  newCategoryContainer: {
    backgroundColor: Theme.ColorsTheme.primary,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  newCategoryText: {
    color: '#fff',
    fontSize: 15,
  },
});
