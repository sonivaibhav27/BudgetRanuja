/**
 * @format
 */
import './src/app/extensions/number.extension';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initializeWatermenlonDb} from './src/database';

export const WatermenlonDB = initializeWatermenlonDb();
AppRegistry.registerComponent(appName, () => App);
