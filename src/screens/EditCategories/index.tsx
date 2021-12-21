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
import {RadioButton, ColorPick} from './component';

type Props = StackScreenProps<MainStackScreenType, 'EditCategory'>;
export default (props: Props) => {
  const [newName, setNewName] = React.useState(
    props.route.params.categoryName || '',
  );
  const [billType, setBillType] = React.useState<'income' | 'expense'>(
    'expense',
  );
  const [seletectedColor, setSelectedColor] = React.useState(
    props.route.params.categoryColor || '#EC6B56',
  );
  const setDictionaryCategories = useSetRecoilState(
    CategoriesAtom.DictionaryOfCategories,
  );
  const setCustomCurrency = useSetRecoilState(UtilsAtom.Currency);
  const setAllCategories = useSetRecoilState(CategoriesAtom.AllCategories);
  const saveOrEdit = async () => {
    if (props.route.params.comingFrom === 'Category') {
      if (props.route.params.type === 'New') {
        const categories = await CategoryOperations.saveCategory(
          newName,
          billType,
          seletectedColor,
        );
        if (categories) {
          setAllCategories(categories);
          Toast('Succesfully saved the category', 'SHORT');
        }
      } else {
        const categoryIfAny = await CategoryOperations.updateCategory(
          props.route.params.categoryId!,
          newName!,
          seletectedColor,
        );
        if (categoryIfAny) {
          setDictionaryCategories(prev => !prev);
          setAllCategories(categories => {
            const categoryIndex = categories.findIndex(
              category =>
                category.CategoryId! === props.route.params.categoryId!,
            );
            if (categoryIndex !== -1) {
              categories[categoryIndex].CategoryName = newName;
              categories[categoryIndex].CategoryColorCode = seletectedColor;
            }
            console.log(categories);
            return [...categories];
          });
        }
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
          setAllCategories(categories => {
            const foundCategory = categories.find(
              category =>
                category.CategoryId! === props.route.params.categoryId!,
            );
            if (foundCategory) {
              foundCategory.IsDeleted = 1;
            }
            // categories = [..]
            return [...categories];
          });
          props.navigation.pop();
        } catch (err) {}
      }
    }
  };

  const onRadioButtonPress = (type: 'expense' | 'income') => {
    setBillType(type);
  };
  const onColorPickerPress = (color: string) => {
    setSelectedColor(color);
  };
  return (
    <View style={styles.container}>
      {props.route.params.comingFrom === 'Category' &&
        typeof props.route.params.type !== 'undefined' &&
        props.route.params.type === 'New' && (
          <View style={styles.billTypeContainer}>
            <Text style={[{marginBottom: 10}, styles.billTypeText]}>
              Category Type
            </Text>

            <RadioButton
              onPress={onRadioButtonPress}
              selected={billType === 'expense'}
              text="expense"
            />
            <RadioButton
              onPress={onRadioButtonPress}
              selected={billType === 'income'}
              text="income"
            />
          </View>
        )}
      <View style={{marginTop: 20}}>
        <Text style={[{marginBottom: 10}, styles.billTypeText]}>
          {props.route.params.comingFrom} Name
        </Text>

        <TextInput
          maxLength={40}
          style={styles.textInput}
          value={newName}
          onChangeText={e => setNewName(e)}
        />
      </View>

      {props.route.params.comingFrom === 'Category' &&
        billType === 'expense' &&
        (typeof props.route.params.categoryType === 'undefined' ||
          props.route.params.categoryType === 'expense') && (
          <View style={{marginTop: 20}}>
            <View style={styles.colorTitleAndPickedContainer}>
              <Text style={styles.billTypeText}>Category Color</Text>
              <View
                style={[styles.picked, {backgroundColor: seletectedColor}]}
              />
              <Text style={styles.selectedText}>(selected)</Text>
            </View>
            <ColorPick
              onColorPickerPress={onColorPickerPress}
              selectedColor={seletectedColor}
            />
          </View>
        )}
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
  container: {flex: 1, padding: 10, paddingHorizontal: 20},
  textInput: {
    borderWidth: 1,
    padding: 8,
    marginHorizontal: 10,
    borderColor: '#EEE',
    fontSize: 18,
    fontWeight: '400',
    borderRadius: 8,
    paddingHorizontal: 10,
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
  billTypeContainer: {
    // marginHorizontal: 10,
    marginVertical: 8,
  },
  billTypeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  colorTitleAndPickedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picked: {
    height: 15,
    width: 15,
    borderRadius: 15,
    marginLeft: 10,
  },
  selectedText: {
    fontSize: 12,
    color: '#222',
    marginLeft: 4,
  },
});
