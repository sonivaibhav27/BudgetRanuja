/**
 * @format
 */
import {AppRegistry} from 'react-native';
import * as Sentry from '@sentry/react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  BudgetBillModel,
  Schema,
  BudgetModel,
  CategoryModel,
} from './src/database';
import {DatabaseConfig, Keys} from './src/config';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Database} from '@nozbe/watermelondb';
import migrations from './src/database/_init/migrations';
import {NativeModuleFunctions, QonversionManager} from './src/utils';

NativeModuleFunctions.initializeDebugFacebook();

Sentry.init({
  dsn: Keys.REMOTE_LOGGER_KEY,
  enableAutoSessionTracking: true,
  environment: __DEV__ ? 'development' : 'production',
});

QonversionManager.launchQonversionSDK();
const adapter = new SQLiteAdapter({
  schema: Schema,
  jsi: false,
  dbName: DatabaseConfig.dbName,
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.log(error);
  },
  // migrations: [],
});
export const WatermenlonDB = new Database({
  adapter,
  modelClasses: [BudgetBillModel, BudgetModel, CategoryModel],
});

AppRegistry.registerComponent(appName, () => App);
