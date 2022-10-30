import {Model} from '@nozbe/watermelondb';
interface baseCategoryType {
  CategoryId?: string;
  CategoryName?: string;
  IsDeleted?: number;
  CategoryColorCode?: string;
}
export interface TCategories extends baseCategoryType {
  CategoryType?: 'income' | 'expense';
}

export interface TCategoriesDatabaseModel extends Model, baseCategoryType {
  CategoryType?: 1 | 2;
}
