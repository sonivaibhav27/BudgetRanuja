import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from '@invertase/react-native-google-ads';
import React from 'react';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: false,
});
const UseInterstitialAd: () => [boolean, () => void, () => void, () => void] =
  () => {
    const [adDismissed, setAdDismissed] = React.useState(false);
    const eventHandler = () => {
      const event = interstitial.onAdEvent(type => {
        if (type === AdEventType.CLOSED) {
          setAdDismissed(true);
        }
        if (type === AdEventType.ERROR) {
          setAdDismissed(true);
        }
      });

      loadAd();
      return event;
    };
    React.useEffect(() => {
      const event = eventHandler();
      return () => event();
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const DismissedAdCallback = () => {
      setAdDismissed(false);
    };

    const loadAd = () => {
      if (!interstitial.loaded) {
        console.log('Inter Ad Loading ');
        interstitial.load();
      }
    };

    const showAd = () => {
      if (interstitial.loaded) {
        interstitial.show();
      }
    };

    return [adDismissed, loadAd, showAd, DismissedAdCallback];
  };

export default UseInterstitialAd;
