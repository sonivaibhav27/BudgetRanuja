import Model from '@nozbe/watermelondb/Model';

interface baseBillType {
  billAmount?: number;
  billRemark?: string;
  categoryId?: string;
  billMonthAndYear?: number;
}

interface baseCategoryType {
  CategoryId?: string;
  CategoryName?: string;
  IsDeleted?: number;
  CategoryColorCode?: string;
}
interface baseBudgetType {
  DateAsYearAndMonth?: number;
  BudgetAmount?: number;
}

export interface TBillType extends baseBillType {
  billType?: 'expense' | 'income';
}

export interface TBillDetail extends TBillType {
  billDate?: Date;
}

export interface TCategoryType extends baseCategoryType {
  CategoryType?: 'income' | 'expense';
}

export interface CategoryModelType extends Model, baseCategoryType {
  CategoryType?: 1 | 2;
}

export interface BudgetModelType extends Model, baseBudgetType {
  CategoryType?: 1 | 2;
}
export interface BillModelType extends Model, baseBillType {
  billType?: 1 | 2;
  billDate?: Date;
}

export interface OnlyInformationFromBillType {
  billAmount: number;
  typeOfBill?: 'expense' | 'income';
  categoryId: string;
}

export interface TCSVBills extends TBillDetail {
  categoryName: string;
}

export interface TEditBills extends Omit<TBillDetail, 'billDate'> {
  billDate?: string;
  id: string;
}

export * as ExtraDetailTypes from './ExtraDetail';
