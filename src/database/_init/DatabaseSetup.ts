import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Platform} from 'react-native';
import {DatabaseConfig} from '../../config';
import Schema from './schema';
import {BudgetBillModel} from './models';

function DatabaseSetup() {
  const adapter = new SQLiteAdapter({
    schema: Schema,
    jsi: Platform.OS === 'ios',
    dbName: DatabaseConfig.dbName,
    onSetUpError: error => {
      // Database failed to load -- offer the user to reload the app or log out
      console.log(error);
    },
  });
  return new Database({
    adapter,
    modelClasses: [
      // Post, // ⬅️ You'll add Models to Watermelon here
      BudgetBillModel,
    ],
  });
}

export default DatabaseSetup;
