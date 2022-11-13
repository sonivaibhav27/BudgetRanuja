import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Database from '@nozbe/watermelondb/Database';
import Utils from '../app/utils';
import {DBNAME} from './db.config';
import {BudgetBillModel, BudgetModel, CategoryModel} from './_init/models';
import Schema from './_init/schema';

export default () => {
  const adapter = new SQLiteAdapter({
    schema: Schema,
    jsi: true,
    dbName: DBNAME,
    onSetUpError: error => {
      // Database failed to load -- offer the user to reload the app or log out
      console.log(error);
      Utils.makeToast(
        'Failed to load database, Kindly Restart the app. ' + error.message,
        'LONG',
      );
    },
    // migrations: [],
  });

  return new Database({
    adapter,
    modelClasses: [BudgetBillModel, BudgetModel, CategoryModel],
  });
};
