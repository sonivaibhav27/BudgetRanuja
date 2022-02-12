import React from 'react';
import {
  AdsConsentStatus,
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';

const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-2540765935808056/3919212526';
export default ({
  consentStatus,
  premiumUser,
}: {
  consentStatus: 0 | 1 | 2;
  premiumUser: boolean;
}) => {
  if (consentStatus !== 0 && !premiumUser) {
    return (
      <BannerAd
        size={BannerAdSize.ADAPTIVE_BANNER}
        unitId={BANNER_ID}
        requestOptions={{
          requestNonPersonalizedAdsOnly:
            consentStatus === AdsConsentStatus.NON_PERSONALIZED,
        }}
      />
    );
  }
  return null;
};
