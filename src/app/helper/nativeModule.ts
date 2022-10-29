import {NativeModules} from 'react-native';
const {CustomNativeModule} = NativeModules;

type IAppVersionCallback = (version: string) => void;
class NativeModule {
  static setAppLovinConsent(consent: boolean) {
    CustomNativeModule.applovinConsent(consent);
  }
  static initializeDebugFacebook() {
    if (__DEV__) {
      CustomNativeModule.fbDebug();
    }
  }
  static getAppVersion(callback: IAppVersionCallback) {
    CustomNativeModule.getAppVersion(callback);
  }
}

export default NativeModule;
