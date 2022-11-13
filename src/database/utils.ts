import {BillTypes, CategoriesTypes, UtilTypes} from '../types';
import {CategoryOperations} from './operations';

export default class DbUtils {
  static groupBillsByCategory = (
    bills: UtilTypes.TOnlyInformationFromBill[],
  ) => {
    const categoryDictionary = CategoryOperations.getDictionary();
    const dict: {[key: string]: [number, string]} = {};
    for (let bill of bills) {
      const categoryDetail = categoryDictionary[bill.categoryId];
      if (categoryDetail) {
        if (dict.hasOwnProperty(categoryDetail[0])) {
          dict[categoryDetail[0]][0] += bill.billAmount!;
        } else {
          dict[categoryDetail[0]] = [bill.billAmount!, categoryDetail[1]!];
        }
      }
    }
    let groupedCategories: {
      billCategory: string;
      billAmount: number;
      categoryColor: string;
    }[] = [];
    Object.entries(dict).map(([key, value]) => {
      groupedCategories.push({
        billCategory: key,
        billAmount: value[0],
        categoryColor: value[1],
      });
    });
    return groupedCategories;
  };

  static getActiveCategoriesByCategoryType = (
    type: 'income' | 'expense',
    data: CategoriesTypes.TCategories[],
  ) => data.filter(item => item.CategoryType! === type && item.IsDeleted === 0);

  static getAllCategoriesByCategoryType = (
    type: 'income' | 'expense',
    data: CategoriesTypes.TCategories[],
  ) => data.filter(item => item.CategoryType! === type);

  static assignCategoryName = (bills: BillTypes.TBill[]) => {
    let returnedValues: BillTypes.TCSVBill[] = [];
    const categories = CategoryOperations._rawDictionary;
    for (let i = 0; i < bills.length; i++) {
      const category = categories[bills[i].categoryId!];
      if (category) {
        returnedValues.push({
          ...bills[i],
          categoryName: category[0],
        });
      }
    }
    return returnedValues;
  };
}
