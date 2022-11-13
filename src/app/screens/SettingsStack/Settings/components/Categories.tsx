import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useRecoilCallback} from 'recoil';
import {DbUtils} from '../../../../../database';
import {CategoriesTypes, NavigationTypes} from '../../../../../types';
import {CategoriesToDisplay, PressableTextButton} from '../../../../components';
import {CategoryState} from '../../../../state';
import {COLORS, PADDING} from '../../../../theme';

interface Props {
  navigation: StackNavigationProp<
    NavigationTypes.TSettingStackScreen,
    'Settings'
  >;
}
export default ({navigation}: Props) => {
  const [expenseCategories, setExpenseCategories] = React.useState<
    CategoriesTypes.TCategories[]
  >([]);
  const [incomeCategories, setIncomeCategories] = React.useState<
    CategoriesTypes.TCategories[]
  >([]);
  const getCategoriesFromRecoil = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const getCategories: CategoriesTypes.TCategories[] =
          snapshot.getLoadable(CategoryState.allCategoryAtom).contents;
        const expenseCategoriesFiltered =
          DbUtils.getActiveCategoriesByCategoryType('expense', getCategories);
        const setIncomeCategoriesFiltered =
          DbUtils.getActiveCategoriesByCategoryType('income', getCategories);
        setExpenseCategories(expenseCategoriesFiltered);
        setIncomeCategories(setIncomeCategoriesFiltered);
      },
    [],
  );
  useFocusEffect(
    React.useCallback(() => {
      getCategoriesFromRecoil();
    }, [getCategoriesFromRecoil]),
  );

  const navigateToEditCategoy = (item: CategoriesTypes.TCategories) => {
    if (!item.CategoryType) return;
    navigation.navigate('Edit', {
      category: {
        categoryId: item.CategoryId!,
        categoryName: item.CategoryName!,
        categoryColor: item.CategoryColorCode!,
        categoryType: item.CategoryType!,
      },
      categories:
        item.CategoryType === 'income' ? incomeCategories : expenseCategories,
      comingFrom: 'Category',
    });
  };

  const goToNewCategory = () => {
    navigation.navigate('Edit', {
      comingFrom: 'Category',
      type: 'New',
    });
  };

  return (
    <ScrollView>
      <PressableTextButton
        onPress={goToNewCategory}
        text="Add new category"
        style={styles.newCategoryContainer}
        textStyle={styles.newCategoryText}
      />
      <CategoriesToDisplay
        title="Expense Categories"
        onItemPress={(category: CategoriesTypes.TCategories) =>
          navigateToEditCategoy(category)
        }
        categories={expenseCategories}
      />
      <CategoriesToDisplay
        title="Income Categories"
        onItemPress={(category: CategoriesTypes.TCategories) =>
          navigateToEditCategoy(category)
        }
        categories={incomeCategories}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  newCategoryContainer: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    padding: PADDING.big,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  newCategoryText: {
    color: COLORS.white,
    fontSize: 15,
  },
});
