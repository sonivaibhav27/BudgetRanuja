import {
  AdsConsentStatus,
  GoogleAdsTypes,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@invertase/react-native-google-ads';
import React from 'react';

const REWARDED_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-2540765935808056/8979967510';
const UseRewardAd: () => [
  boolean,
  () => void,
  () => void,
  (s: number) => void,
] = () => {
  const [adDismissed, setAdDismissed] = React.useState(false);
  const [rewarded, setRewarded] = React.useState<GoogleAdsTypes.RewardedAd>();
  const isWatchedAdRef = React.useRef(false);
  const eventHandler = React.useCallback(() => {
    if (rewarded) {
      const event = rewarded.onAdEvent((type, error) => {
        if (error) {
          setAdDismissed(true);
          return;
        }
        if (type === RewardedAdEventType.LOADED) {
          rewarded.show();
        } else if (type === 'rewarded_earned_reward') {
          isWatchedAdRef.current = true;
        } else if (type === 'closed') {
          if (isWatchedAdRef.current) {
            isWatchedAdRef.current = false;
            setAdDismissed(true);
          }
        }
      });
      return event;
    }
  }, [rewarded]);

  React.useEffect(() => {
    const event = eventHandler();
    return event;
  }, [eventHandler]);

  const rewardedModify = (status: number) => {
    const _rewarded = RewardedAd.createForAdRequest(
      //   'ca-app-pub-3940256099942544/5224354917',
      REWARDED_ID,
      {
        requestNonPersonalizedAdsOnly:
          AdsConsentStatus.NON_PERSONALIZED === status,
      },
    );
    setRewarded(_rewarded);
  };

  const DismissedAdCallback = () => {
    isWatchedAdRef.current = false;
    setAdDismissed(false);
  };

  const loadAd = React.useCallback(() => {
    if (rewarded) {
      if (!rewarded.loaded) {
        rewarded.load();
      }
    }
  }, [rewarded]);

  return [adDismissed, loadAd, DismissedAdCallback, rewardedModify];
};

export default UseRewardAd;
