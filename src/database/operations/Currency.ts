import {WatermenlonDB} from '../../..';
import Helper from '../../app/utils';

export default class Currency {
  static _symbol = 'user_currency_symbol';
  static _name = 'user_currency_name';
  static async setCurrency(currencyName: string, currency: string) {
    if (currency.length <= 0) {
      Helper.makeToast("Can't save empty currency");
      return;
    }
    try {
      await WatermenlonDB.adapter.setLocal(this._symbol, currency);
      await WatermenlonDB.adapter.setLocal(this._name, currencyName);
    } catch (err: any) {
      Helper.makeToast('Error: ' + err.message);
    }
  }
  static async getCurrency() {
    try {
      const symbol = await WatermenlonDB.adapter.getLocal(this._symbol);
      const name = await WatermenlonDB.adapter.getLocal(this._name);
      if (!symbol && !name) {
        return {symbol: '$', name: 'USD Dollar'};
      }
      return {symbol, name};
    } catch (err: any) {
      // return default value if  not found.
      Helper.makeToast('Error: ' + err.message);
      return {symbol: '$', name: 'USD Dollar'};
    }
  }
}
