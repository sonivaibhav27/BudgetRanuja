import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {CategoryOperations, CurrencyOperations} from '../../../../database';
import {NavigationTypes} from '../../../../types';
import {
  PressableTextButton,
  RadioButton,
  Text,
  TextInput,
} from '../../../components';
import {CategoryState, UtilState} from '../../../state';
import CommonStyles from '../../../styles';
import {COLORS, PADDING} from '../../../theme';
import Utils from '../../../utils';
import {ColorPick} from './component';

type Props = StackScreenProps<NavigationTypes.TSettingStackScreen, 'Edit'>;
export default (props: Props) => {
  const [newName, setNewName] = React.useState(
    props.route.params.category?.categoryName || '',
  );
  const [billType, setBillType] = React.useState<'income' | 'expense'>(
    'expense',
  );
  const [seletectedColor, setSelectedColor] = React.useState(
    props.route.params.category?.categoryColor || '#EC6B56',
  );
  //To update the call . Dummy Selector.
  const setDictionaryCategories = useSetRecoilState(
    CategoryState.categoryDictionaryCategoryAtom,
  );
  const setCustomCurrency = useSetRecoilState(UtilState.currencyUtilAtom);
  const setAllCategories = useSetRecoilState(CategoryState.allCategoryAtom);

  React.useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      props.navigation.pop();
      return true;
    });
    return () => {
      handler.remove();
    };
  }, [props.navigation]);

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
          Utils.makeToast('Succesfully saved the category', 'SHORT');
        }
      } else {
        const categoryIfAny = await CategoryOperations.updateCategory(
          props.route.params.category!.categoryId!,
          newName!,
          seletectedColor,
        );
        if (categoryIfAny) {
          setDictionaryCategories(prev => !prev);
          setAllCategories(categories => {
            const categoryIndex = categories.findIndex(
              category =>
                category.CategoryId! ===
                props.route.params.category!.categoryId,
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
        Utils.makeToast("Can't set empty currency symbol");
        return;
      }
      await CurrencyOperations.setCurrency('Custom', newName);
      Utils.makeToast('Currency set successfully');
      setCustomCurrency(newName);
    }
  };

  const deleteCategory = async () => {
    const categories = props.route.params.categories;
    if (categories) {
      if (categories.length === 1) {
        Utils.makeToast(
          "Can't Delete Last categories, Minimum Categories required is 1.",
          'LONG',
        );
      } else {
        try {
          await CategoryOperations.deleteCategory(
            props.route.params.category!.categoryId!,
          );
          setAllCategories(_categories => {
            const foundCategory = _categories.find(
              category =>
                category.CategoryId! ===
                props.route.params.category!.categoryId,
            );
            if (foundCategory) {
              foundCategory.IsDeleted = 1;
            }
            // categories = [..]
            return [..._categories];
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
    <View
      style={[CommonStyles.screenContainer, {paddingHorizontal: PADDING.big}]}>
      {props.route.params.comingFrom === 'Category' &&
        typeof props.route.params.type !== 'undefined' &&
        props.route.params.type === 'New' && (
          <View style={styles.billTypeContainer}>
            <Text
              textType="heading"
              style={[{marginBottom: 10}, styles.billTypeText]}>
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
        <Text
          textType="subheading"
          style={[{marginBottom: 10}, styles.billTypeText]}>
          {props.route.params.comingFrom} Name
        </Text>

        <TextInput
          placeholder={`Enter ${props.route.params.comingFrom}`}
          // maxLength={40}
          style={styles.textInput}
          value={newName}
          onChangeText={e => setNewName(e)}
        />
      </View>

      {props.route.params.comingFrom === 'Category' &&
        billType === 'expense' &&
        (typeof props.route.params.category === 'undefined' ||
          props.route.params.category?.categoryType === 'expense') && (
          <View style={{marginTop: 20}}>
            <View style={styles.colorTitleAndPickedContainer}>
              <Text textType="subheading" style={styles.billTypeText}>
                Category Color
              </Text>
              <View
                style={[styles.picked, {backgroundColor: seletectedColor}]}
              />
              <Text textType="paragraph" style={styles.selectedText}>
                (selected)
              </Text>
            </View>
            <ColorPick
              onColorPickerPress={onColorPickerPress}
              selectedColor={seletectedColor}
            />
          </View>
        )}
      <View style={styles.buttonContainer}>
        {props.route.params.category !== undefined &&
          props.route.params.category.categoryId && (
            <PressableTextButton
              textType="subheading"
              textStyle={{color: COLORS.black}}
              text="Delete"
              onPress={deleteCategory}
              style={[styles.common, styles.deleteButton]}
            />
          )}
        <PressableTextButton
          text="Save"
          textType="subheading"
          onPress={saveOrEdit}
          style={[styles.common, styles.saveButton]}
          textStyle={styles.saveText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: PADDING.medium,
    marginHorizontal: 10,
    backgroundColor: COLORS.white,
    fontSize: 18,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: '#000',
    borderBottomWidth: 1,
    borderColor: COLORS.mediumGray,
  },
  buttonContainer: {
    marginTop: 20,
  },
  common: {
    padding: PADDING.big,
    marginHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: '#f1f1f1',
    padding: PADDING.big,
  },
  billTypeContainer: {
    // marginHorizontal: 10,
    marginVertical: 8,
  },
  billTypeText: {
    color: '#000',
    fontSize: 14,
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
    color: '#666',
    marginLeft: 4,
  },
});
