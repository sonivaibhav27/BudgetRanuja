import {Alert, Linking, PermissionsAndroid, ToastAndroid} from 'react-native';
import {BillTypes} from '../../types';
export default class Utils {
  static makeAlert = (
    title: string,
    message: string,
    onOkPress: () => void = () => {},
    showCancel: boolean = false,
    okText: string = 'OK',
  ) => {
    Alert.alert(title, message, [
      {
        text: showCancel ? 'Cancel' : '',
      },
      {text: okText, onPress: onOkPress},
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
    // return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    // let whole = amount
    return amount.formatIntoCurrency();
  };
  static generateUUID = () => {
    const randomNumber = Math.round((Math.random() * 1000) / 12).toString();
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substr(2) +
      randomNumber
    );
  };

  //todo : change this to generic object instead.
  static getTotalAmount = (data: BillTypes.TBillDatabaseModel[]) => {
    return data ? data.reduce((prev, curr) => prev + curr.billAmount!, 0) : -1;
  };
  static getMonths = () => {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  };
  static checkOrRequestStoragePermission = async () => {
    const permission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!permission) {
      const response = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (response === 'granted') {
        return true;
      } else if (response === 'denied') {
        this.makeToast('Need Permission to download file.', 'LONG');
        return false;
      } else {
        this.makeAlert(
          'Storage Permission',
          'Need storage permission to download the file.',
          () => {
            try {
              Linking.openSettings();
            } catch (err) {}
          },
          false,
          'Open Settings',
        );
        return false;
      }
    }
    return true;
  };

  static isValidObject = (object: any): boolean => {
    return typeof object !== 'undefined';
  };
  static convertToCurrency = () => {
    return new Intl.NumberFormat('en-us', {
      currency: 'USD',
      style: 'currency',
    }).format(100000);
  };
}
