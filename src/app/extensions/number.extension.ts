import {NativeModules} from 'react-native';

declare global {
  interface Number {
    /**
     * @return Currency format based on current locale of the application.
     */
    formatIntoCurrency(): string;
  }
}
let currentLocale = NativeModules.I18nManager.localeIdentifier?.replace(
  '_',
  '-',
);
const IntlObject = new Intl.NumberFormat(currentLocale || 'en-us');

//eslint-disable-next-line no-extend-native
Number.prototype.formatIntoCurrency = function () {
  return IntlObject.format(this as number);
};
