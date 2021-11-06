import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';
import {DatabaseConfig} from '../../../config';

export default class BudgetBill extends Model {
  static table = DatabaseConfig.tables.BudgetBills;

  @field('Type') billType!: number;

  @field('Category') billCategory!: string;

  @field('Amount') billAmount!: number;
  @field('Remark') billRemark!: string;
  @field('Date') billDate!: number;
}
