import React from 'react';
import * as Sentry from '@sentry/react-native';
import {Keys} from './config';
import {useGetDBDataOnAppStart} from './hooks';
import OneSignal from 'react-native-onesignal';
import {PaymentManager} from './helper';
import Utils from './utils';

export default () => {
  const isLoaded = useGetDBDataOnAppStart();
  const loadThirdPartyPlugins = () => {
    Sentry.init({
      dsn: Keys.SENTRY_KEY,
      enableAutoSessionTracking: true,
      environment: __DEV__ ? 'development' : 'production',
    });
    if (!__DEV__) {
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId(Keys.ONESIGNAL_KEY);
    }
    PaymentManager.launchQonversionSDK().catch(e => {
      Utils.makeToast(
        'Failed to initialize payment configuration: ' + e.message || '',
      );
    });
  };
  React.useEffect(() => {
    loadThirdPartyPlugins();
  }, []);
  return isLoaded;
};
