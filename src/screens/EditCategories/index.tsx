import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {PressableButton} from '../../common';
import {CategoryOperations, CurrencyOperations} from '../../database';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {CategoriesAtom, UtilsAtom} from '../../State/Atoms';
import {Theme} from '../../theme&styles';
import {Toast} from '../../utils';

type Props = StackScreenProps<MainStackScreenType, 'EditCategory'>;
export default (props: Props) => {
  const [newName, setNewName] = React.useState(props.route.params.categoryName);
  const setDictionaryCategories = useSetRecoilState(
    CategoriesAtom.DictionaryOfCategories,
  );
  const setCustomCurrency = useSetRecoilState(UtilsAtom.Currency);
  const saveOrEdit = async () => {
    if (props.route.params.comingFrom === 'Category') {
      const isSuccess = await CategoryOperations.updateCategory(
        props.route.params.categoryId!,
        props.route.params.categoryName!,
        newName!,
      );
      if (isSuccess) {
        setDictionaryCategories(prev => !prev);
      }
    } else {
      if (typeof newName === 'undefined') {
        return;
      }
      if (newName.length === 0) {
        Toast("Can't set empty currency symbol");
        return;
      }
      await CurrencyOperations.setCurrency('Custom', newName);
      setCustomCurrency(newName);
    }
  };

  const deleteCategory = async () => {
    const categoryType = props.route.params.categoryType!;
    const getAllCategoriesOfType = props.route?.params?.allCategories?.filter(
      category => category.CategoryType! === categoryType,
    );

    if (getAllCategoriesOfType) {
      if (getAllCategoriesOfType.length === 1) {
        Toast(
          "Can't Delete Last categories, Minimum Categories required is 1.",
          'LONG',
        );
      } else {
        try {
          await CategoryOperations.deleteCategory(
            props.route.params.categoryId!,
          );
          props.navigation.pop();
        } catch (err) {}
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={newName}
        onChangeText={e => setNewName(e)}
      />
      <View style={styles.buttonContainer}>
        {props.route.params.categoryId && (
          <PressableButton
            onPress={deleteCategory}
            style={[styles.common, styles.deleteButton]}>
            <Text style={[styles.buttonText, styles.deleteText]}>Delete</Text>
          </PressableButton>
        )}
        <PressableButton
          onPress={saveOrEdit}
          style={[styles.common, styles.saveButton]}>
          <Text style={[styles.buttonText, styles.saveText]}>Save</Text>
        </PressableButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  textInput: {
    borderWidth: 1,
    padding: 8,
    marginHorizontal: 10,
    borderColor: '#EEE',
    fontSize: 18,
    fontWeight: '400',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  common: {
    flex: 1,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'red',
    // backgroundColor: 'red',
  },
  saveButton: {
    backgroundColor: Theme.ColorsTheme.primary,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 18,
  },
  saveText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f1f1f1',
  },
});
