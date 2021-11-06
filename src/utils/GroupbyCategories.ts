import {ModelTypes} from '../database';
import Logger from './logger';

export default function GroupByCategories(filtered: ModelTypes.BillTypes[]) {
  const copyFiltered = [...filtered];
  const seenType: string[] = [];
  const finalGroupedCategories: ModelTypes.BillTypes[] = [];
  for (let i = 0; i < copyFiltered.length; i++) {
    if (seenType.includes(copyFiltered[i].billCategory!)) {
      const find = finalGroupedCategories.find(data => {
        return data.billCategory === copyFiltered[i].billCategory;
      });

      copyFiltered[i].billAmount =
        copyFiltered[i].billAmount! + find?.billAmount!;
      if (find) {
        var index = finalGroupedCategories.indexOf(find);
        finalGroupedCategories.splice(index, 1);
      }
    } else {
      seenType.push(copyFiltered[i].billCategory!);
    }

    finalGroupedCategories.push(copyFiltered[i]);
  }
  Group(filtered);
  finalGroupedCategories.map(bill => {
    Logger.consoleLog(`v1 - ${JSON.stringify(bill)}`, 'log');
  });
  // Logger.consoleLog(`v1 - ${finalGroupedCategories.map(item => )}`, 'log');
  return finalGroupedCategories;
}

function Group(bills: ModelTypes.BillTypes[]) {
  const dict: {[key: string]: number} = {};

  for (let bill of bills) {
    if (bill.billCategory) {
      if (dict.hasOwnProperty(bill.billCategory!)) {
        dict[bill.billCategory] += bill.billAmount!;
      } else {
        dict[bill.billCategory] = bill.billAmount!;
      }
    }
  }
  // Logger.consoleLog(Array.from(dict), 'log');
  Logger.consoleLog(dict, 'log');
}
