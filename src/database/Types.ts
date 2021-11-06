import {Model} from '@nozbe/watermelondb';

export interface BillTypes extends Model {
  billType?: 1 | 2;
  billAmount?: number;
  billCategory?: string;
  billDate?: number;
  billRemark?: string;
}

export interface BudgetTypes extends Model {
  DateAsMonthAndYear?: number;
  BudgetAmount?: number;
}
