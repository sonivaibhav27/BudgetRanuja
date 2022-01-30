import React from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';

export default ({nonPersonalized}: {nonPersonalized: boolean}) => {
  return (
    <BannerAd
      size={BannerAdSize.ADAPTIVE_BANNER}
      unitId={TestIds.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: nonPersonalized,
      }}
    />
  );
};
