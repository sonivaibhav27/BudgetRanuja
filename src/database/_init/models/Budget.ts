import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {TABLES} from '../../db.config';

export default class Budget extends Model {
  static table = TABLES.Budget;

  @field('BudgetAmount') BudgetAmount!: number;

  @field('DateAsYearAndMonth') DateAsYearAndMonth!: number;
}
