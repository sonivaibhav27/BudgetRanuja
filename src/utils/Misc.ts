import {CategoryOperations} from '../database';
import {TBillDetail} from '../types';

class ApplicationError extends Error {
  constructor(name: string, message?: string) {
    super(message);
    this.name = name;
  }
}
export const MonthAccordingToDatahase = (month: number) => {
  return month < 10 ? `0${month}` : `${month}`;
};

export const GenerateUUID = () => {
  const randomNumber = Math.round((Math.random() * 1000) / 12).toString();
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substr(2) +
    randomNumber
  );
};

export const findKeyByValue = (categoryName: string) => {
  const dictionaryOfCategory = CategoryOperations._rawDictionary;
  return Object.keys(dictionaryOfCategory).find(
    key => dictionaryOfCategory[key][0] === categoryName,
  );
};

export const ValidateBill = (bill: TBillDetail, billAmount: string) => {
  if (typeof billAmount === 'undefined' || billAmount.length === 0) {
    throw new ApplicationError(
      'ApplicationError',
      'Please fill amount to save bill.',
    );
  }
  if (
    bill.categoryId!.length === 0 ||
    bill.billDate === null ||
    typeof bill.billDate === 'undefined' ||
    typeof billAmount === 'undefined' ||
    (bill.billType !== 'expense' && bill.billType !== 'income')
  ) {
    throw new ApplicationError(
      'ApplicationError',
      'Please fill all mandatory Detail',
    );
  }
  if (!/^[-]?\d+$/.test(billAmount)) {
    throw new ApplicationError(
      'ApplicationError',
      'Amount should be of type number only',
    );
  }
  if (Number(billAmount) < 0) {
    throw new ApplicationError(
      'ApplicationError',
      "Bill Amount can't be less than 0",
    );
  }
};

export const ValidateEditBill = (
  bill: TBillDetail,
  billAmount: string,
  id?: string,
) => {
  if (typeof id === 'undefined' || id.length === 0) {
    throw new ApplicationError(
      'ApplicationError',
      'Something went wrong, please reload the app.',
    );
  }
  ValidateBill(bill, billAmount);
};

export const formatIntoCurrency = (amount: number) => {
  // $&  is reference to the matched section
  // ?= is followed by , here bottom 1 digit followed by 3 digit
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
