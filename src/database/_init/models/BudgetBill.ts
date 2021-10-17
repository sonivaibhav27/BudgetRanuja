import {Model} from '@nozbe/watermelondb';
import {field, date, writer} from '@nozbe/watermelondb/decorators';
import {DatabaseConfig} from '../../../config';

export default class BudgetBill extends Model {
  static table = DatabaseConfig.tables.BudgetBills;

  @field('Type') TypeOfBill;

  @field('Category') CategoryOfBills;

  @field('Amount') Amount;
  @field('Remark') Remark;
  @date('Date') Date;

  @writer async write() {
    this.collections.get(DatabaseConfig.tables.BudgetBills).create(record => {
      (record.TypeOfBill = 'income'),
        (record.CategoryOfBills = 'cash'),
        (record.Amount = 200000),
        (record.Date = new Date().toString());
    });
  }
}
