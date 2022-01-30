import {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
} from '@invertase/react-native-google-ads';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {MainStackScreenType} from '../../navigations/MainStack/types';

type UserConsentStatus = 0 | 1 | 2 | null;

const useAdsConsentHook = () => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackScreenType, 'Create'>>();
  const [userConsent, setUserConsent] = React.useState<UserConsentStatus>(null);
  const consentFormInit = async () => {
    try {
      // '3F44BA187AF662C093736ABFE3CD1D46';
      await AdsConsent.addTestDevices(['3EAEEE69510ACC7BE82166A9D097FC3D']);
      //Production emulator
      // await AdsConsent.addTestDevices(["0582F08BCC86D7B2E3B50E1B53A98478"]);
      await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
      await AdsConsent.addTestDevices(['05ADAA36163BF09902D81CCEC9FA322C']);
      await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
      const consentInfo = await AdsConsent.requestInfoUpdate([
        'pub-2540765935808056',
      ]);

      if (consentInfo.isRequestLocationInEeaOrUnknown) {
        const getUserStatus = await AdsConsent.getStatus();
        if (getUserStatus === AdsConsentStatus.UNKNOWN) {
          const formResult = await AdsConsent.showForm({
            privacyPolicy: 'https://ranuja-apps.github.io/',
            withPersonalizedAds: true,
            withNonPersonalizedAds: true,
            withAdFree: true,
          });
          if (formResult.userPrefersAdFree) {
            navigation.navigate('Pricing', {
              cameFromConsentForm: true,
            });
          }
          if (
            formResult.status === AdsConsentStatus.PERSONALIZED ||
            formResult.status === AdsConsentStatus.NON_PERSONALIZED
          ) {
            setUserConsent(formResult.status);
          } else {
            //Don't allow user In.
          }
        } else {
          setUserConsent(getUserStatus);
        }
      } else {
        setUserConsent(AdsConsentStatus.PERSONALIZED);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    consentFormInit();
  }, []);
  return [userConsent, AdsConsentStatus];
};

export default useAdsConsentHook;
