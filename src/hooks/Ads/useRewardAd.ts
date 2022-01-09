import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@invertase/react-native-google-ads';
import {Toast} from '../../utils';
import React from 'react';

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
  requestNonPersonalizedAdsOnly: true,
});
export default (onSuccessCallback: () => void) => {
  const setupEventHanlders = React.useCallback(() => {
    const event = rewarded.onAdEvent((type, error) => {
      if (error) {
        Toast('Error in showing ad' + error.message);
        return;
      }
      if (type === RewardedAdEventType.LOADED) {
        rewarded.show();
      } else if (type === 'rewarded_earned_reward') {
        onSuccessCallback();
      }
    });
    return event;
  }, [onSuccessCallback]);
  React.useEffect(() => {
    setupEventHanlders();
  }, [setupEventHanlders]);

  const loadAd = React.useCallback(() => {
    try {
      rewarded.load();
    } catch (err) {
      Toast('Error in loading Ad ');
    }
  }, []);

  return [loadAd, setupEventHanlders];
};
