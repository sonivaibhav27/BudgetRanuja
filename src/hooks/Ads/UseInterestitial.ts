import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from '@invertase/react-native-google-ads';
import React from 'react';

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-2540765935808056/3434906455';
const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
  requestNonPersonalizedAdsOnly: false,
});
const UseInterstitialAd: () => [
  boolean,
  () => void,
  () => boolean,
  () => void,
] = () => {
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
      return true;
    }
    return false;
  };

  return [adDismissed, loadAd, showAd, DismissedAdCallback];
};

export default UseInterstitialAd;
