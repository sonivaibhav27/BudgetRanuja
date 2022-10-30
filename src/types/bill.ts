import {Model} from '@nozbe/watermelondb';
interface baseBillType {
  billAmount?: number;
  billRemark?: string;
  categoryId?: string;
  billMonthAndYear?: number;
}

export interface TBill extends baseBillType {
  billType?: 'expense' | 'income';
  billDate?: Date;
}

export interface TCSVBill extends TBill {
  categoryName: string;
}

export interface TEditBill extends Omit<TBill, 'billDate'> {
  billDate?: string;
  id: string;
}
export interface TBillDatabaseModel extends Model, baseBillType {
  billType?: 1 | 2;
  billDate?: Date;
}

export interface TBillWithTypeSanitize
  extends Omit<TBillDatabaseModel, 'billType'> {
  typeOfBill: 'expense' | 'income';
}
