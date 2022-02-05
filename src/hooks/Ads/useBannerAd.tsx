import React from 'react';
import {
  AdsConsentStatus,
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';

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
        unitId={TestIds.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly:
            consentStatus === AdsConsentStatus.NON_PERSONALIZED,
        }}
      />
    );
  }
  return null;
};
