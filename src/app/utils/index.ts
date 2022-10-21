import {Alert, ToastAndroid} from 'react-native';

export default class Utils {
  static makeAlert = (
    title: string,
    message: string,
    onOkPress: () => void = () => {},
    showCancel: boolean = true,
  ) => {
    Alert.alert(title, message, [
      {
        text: showCancel ? 'Cancel' : '',
      },
      {text: 'Ok', onPress: onOkPress},
    ]);
  };
  static makeToast = (message: string, duration: 'SHORT' | 'LONG' = 'LONG') => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid[duration],
      ToastAndroid.BOTTOM,
      0,
      20,
    );
  };
  static findKeyByValue = (valueName: string, dictionary: any) => {
    return Object.keys(dictionary).find(
      key => dictionary[key][0] === valueName,
    );
  };
  static formatIntoCurrency = (amount: number) => {
    // $&  is reference to the matched section
    // ?= is followed by , here bottom 1 digit followed by 3 digit
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };
  static generateUUID = () => {
    const randomNumber = Math.round((Math.random() * 1000) / 12).toString();
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substr(2) +
      randomNumber
    );
  };
}
