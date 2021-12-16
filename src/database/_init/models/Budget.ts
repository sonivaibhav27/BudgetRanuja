import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {DatabaseConfig} from '../../../config';

export default class Budget extends Model {
  static table = DatabaseConfig.tables.Budget;

  @field('BudgetAmount') BudgetAmount!: number;

  @field('DateAsYearAndMonth') DateAsYearAndMonth!: number;
}
