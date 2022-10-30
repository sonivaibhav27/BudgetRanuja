import {Model} from '@nozbe/watermelondb';
interface baseBudgetType {
  DateAsYearAndMonth?: number;
  BudgetAmount?: number;
}

export interface TBudgetDatabaseModel extends Model, baseBudgetType {
  CategoryType?: 1 | 2;
}
