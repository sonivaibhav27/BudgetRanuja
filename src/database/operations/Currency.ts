import {WatermenlonDB} from '../../..';
import {Toast} from '../../utils';

export default class Currency {
  static _symbol = 'user_currency_symbol';
  static _name = 'user_currency_name';
  static async setCurrency(currencyName: string, currency: string) {
    if (currency.length <= 0) {
      Toast("Can't save empty currency");
      return;
    }
    try {
      await WatermenlonDB.adapter.setLocal(this._symbol, currency);
      await WatermenlonDB.adapter.setLocal(this._name, currencyName);
      Toast('Currency Updated Succesfully');
    } catch (err) {
      Toast('Error: ' + err.message);
    }
  }
  static async getCurrency() {
    try {
      const symbol = await WatermenlonDB.adapter.getLocal(this._symbol);
      const name = await WatermenlonDB.adapter.getLocal(this._name);
      return {symbol, name};
    } catch (err) {
      Toast('Error: ' + err.message);
    }
  }
}
