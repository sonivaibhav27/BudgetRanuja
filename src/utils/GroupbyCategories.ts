import {CategoryOperations} from '../database';
import {OnlyInformationFromBillType} from '../types';

export default function GroupByCategories(
  bills: OnlyInformationFromBillType[],
) {
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
}
