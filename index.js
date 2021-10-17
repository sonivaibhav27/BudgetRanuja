/**
 * @format
 */

import {AppRegistry} from 'react-native';
import * as Sentry from '@sentry/react-native';

import App from './App';
import {name as appName} from './app.json';
import {DatabaseSetup} from './src/database';
import {Keys} from './src/config';

Sentry.init({
  dsn: Keys.REMOTE_LOGGER_KEY,
  enableAutoSessionTracking: true,
  environment: __DEV__ ? 'development' : 'production',
});

const database = DatabaseSetup();

AppRegistry.registerComponent(appName, () => App);
