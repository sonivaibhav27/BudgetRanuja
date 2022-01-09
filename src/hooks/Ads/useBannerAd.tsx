import React from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@invertase/react-native-google-ads';
import {Toast} from '../../utils';

export default ({nonPersonalized}: {nonPersonalized: boolean}) => {
  return (
    <BannerAd
      size={BannerAdSize.ADAPTIVE_BANNER}
      unitId={TestIds.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: nonPersonalized,
      }}
      onAdFailedToLoad={err => {
        Toast(err.message);
      }}
    />
  );
};
