import {Alert} from 'react-native';
import Qonversion from 'react-native-qonversion';
import {Keys} from '../config';
import Toast from './Toast';
/**
 * @description Manager for handling the InApp Purchase.
 */
class QonversionManager {
  static permissionId = 'Premium_Production';

  static async launchQonversionSDK() {
    try {
      await Qonversion.launchWithKey(Keys.PURCHASE_SDK_KEY, false);
    } catch (err) {}
  }
  /**
   * @description Check for the active purchase user have made.
   * @returns Permission Object if user have purchased.
   */

  static async getActivePermission() {
    try {
      const permissions = await Qonversion.checkPermissions();
      console.log({permissions});
      const premiumPermission = permissions.get(this.permissionId);
      if (premiumPermission) {
        return premiumPermission.isActive === true;
      }
      return false;
    } catch (err) {
      Toast('Error while getting your purchase status', 'LONG');
      return false;
    }
  }
  /**
   * @description Get offerings to display from qonversion.
   */
  static async getOfferings() {
    try {
      const offerings = await Qonversion.offerings();
      if (
        offerings != null &&
        offerings.main != null &&
        offerings.main.products.length > 0
      ) {
        console.log({offerings});
        return offerings.main.products[0];
      }
    } catch (error) {
      Toast('Failed to get product for purchase ' + error.message, 'SHORT');
      return null;
    }
  }
  /**
   * @description Make payment
   * @param qonversionOfferingId Id of the offering to purchase.
   */
  static async makePayment(qonversionOfferingId: string) {
    try {
      const purchase = await Qonversion.purchase(qonversionOfferingId);
      if (purchase.get(this.permissionId)?.isActive === true) {
        Alert.alert('Success', 'Successfully purchased');
      }
    } catch (error) {
      if (!error.userCanceled) {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    }
  }

  /**
   * @description Restore the user purchased.
   */
  static async restorePurchase() {
    try {
      const permission = await Qonversion.restore();
      if (permission.get(this.permissionId)?.isActive === true) {
        Alert.alert('Success', 'Successfully restored the purchase');
        return;
      }
      Alert.alert('Not found', 'No purchase found.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }
}

export default QonversionManager;
