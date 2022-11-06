import {NativeModules} from 'react-native';
const {CustomNativeModule} = NativeModules;

type IAppVersionCallback = (version: string) => void;
class NativeModule {
  static setAppLovinConsent(consent: boolean) {
    CustomNativeModule.applovinConsent(consent);
  }
  static getAppVersion(callback: IAppVersionCallback) {
    CustomNativeModule.getAppVersion(callback);
  }
}

export default NativeModule;
