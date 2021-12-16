import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {useRecoilCallback} from 'recoil';
import {PressableButton} from '../../../common';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import {CategoriesAtom} from '../../../State/Atoms';
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
    [navigation],
  );
  React.useEffect(() => {
    getCategoriesFromRecoil();
  }, [getCategoriesFromRecoil, navigation]);
  const navigateToEditCategoy = (item: TCategoryType) => {
    navigation.navigate('EditCategory', {
      categoryId: item.CategoryId!,
      categoryName: item.CategoryName!,
      categoryType: item.CategoryType!,
      allCategories: categories,
      comingFrom: 'Category',
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
      //   ListFooterComponent={
      //     <Pressable>
      //       <Text>Enter Your Own.</Text>
      //     </Pressable>
      //   }
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
  },
  code: {
    width: 13,
    height: 13,
    borderRadius: 10,
  },
  separator: {borderBottomWidth: 1, borderBottomColor: '#EEE'},
});
