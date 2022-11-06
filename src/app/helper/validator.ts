import {BillTypes} from '../../types';

class ApplicationError extends Error {
  constructor(name: string, message?: string) {
    super(message);
    this.name = name;
  }
}

export default class Validator {
  static validateBill = (bill: BillTypes.TBill) => {
    if (typeof bill.billAmount === 'undefined') {
      throw new ApplicationError(
        'ApplicationError',
        'Please fill amount to save bill.',
      );
    }
    if (
      typeof bill.categoryId === 'undefined' ||
      bill.categoryId!.length === 0 ||
      typeof bill.billDate === 'undefined' ||
      (bill.billType !== 'expense' && bill.billType !== 'income')
    ) {
      throw new ApplicationError(
        'ApplicationError',
        'Please check Category and amount input.',
      );
    }
    if (!/^\d*(\.\d{0,2})?$/.test(bill.billAmount.toString())) {
      throw new ApplicationError(
        'ApplicationError',
        'Amount should be of type number only and Only 2 Decimal are allowed.',
      );
    }
    if (bill.billAmount < 0) {
      throw new ApplicationError(
        'ApplicationError',
        "Bill Amount can't be less than 0",
      );
    }
  };
  static validateBillWithId = (bill: BillTypes.TBill, id?: string) => {
    if (typeof id === 'undefined' || id.length === 0) {
      throw new ApplicationError(
        'ApplicationError',
        'Something went wrong, please reload the app.',
      );
    }
    this.validateBill(bill);
  };
}
