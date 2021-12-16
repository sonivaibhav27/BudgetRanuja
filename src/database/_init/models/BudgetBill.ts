import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import date from '@nozbe/watermelondb/decorators/date';
import {DatabaseConfig} from '../../../config';

export default class BudgetBill extends Model {
  static table = DatabaseConfig.tables.BudgetBills;
  @field('Type') billType!: number;
  @field('Amount') billAmount!: number;
  @field('Remark') billRemark!: string;
  @date('Date_at') billDate!: Date;
  @field('DateAsYearAndMonth') billMonthAndYear!: number;
  @field('Category_Id') categoryId!: string;
}
