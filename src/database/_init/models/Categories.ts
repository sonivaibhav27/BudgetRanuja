import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {DatabaseConfig} from '../../../config';

class Categories extends Model {
  static table = DatabaseConfig.tables.Categories;
  @field('Category_Id') CategoryId!: string;
  @field('Category_Name') CategoryName!: string;
  @field('IsDeleted') IsDeleted!: number;
  @field('ColorCode') CategoryColorCode!: string;
  @field('Category_Type') CategoryType!: number;
}

export default Categories;
