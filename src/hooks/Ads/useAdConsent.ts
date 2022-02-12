import {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
} from '@invertase/react-native-google-ads';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {useSetRecoilState} from 'recoil';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {UtilsAtom} from '../../State';

type UserConsentStatus = 0 | 1 | 2 | null;

const useAdsConsentHook = () => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackScreenType, 'Create'>>();
  const setUserConsent = useSetRecoilState(UtilsAtom.UserConsent);
  const [isLoaded, setLoaded] = React.useState(false);
  const consentFormInit = async () => {
    try {
      // '3F44BA187AF662C093736ABFE3CD1D46';
      await AdsConsent.addTestDevices([
        '3EAEEE69510ACC7BE82166A9D097FC3D',
        '05ADAA36163BF09902D81CCEC9FA322C',
      ]);
      //Production emulator
      // await AdsConsent.addTestDevices(["0582F08BCC86D7B2E3B50E1B53A98478"]);
      await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
      await AdsConsent.addTestDevices(['05ADAA36163BF09902D81CCEC9FA322C']);
      await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
      const consentInfo = await AdsConsent.requestInfoUpdate([
        'pub-2540765935808056',
      ]);

      console.log({consentInfo});
      if (consentInfo.isRequestLocationInEeaOrUnknown) {
        const getUserStatus = await AdsConsent.getStatus();
        if (getUserStatus === AdsConsentStatus.UNKNOWN) {
          const formResult = await AdsConsent.showForm({
            privacyPolicy: 'https://ranuja-apps.github.io/',
            withPersonalizedAds: true,
            withNonPersonalizedAds: true,
            withAdFree: false,
          });
          if (formResult.userPrefersAdFree) {
            navigation.navigate('Pricing', {version: 'a'});
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
    } catch (err) {
    } finally {
      console.log('finally called.');
      setLoaded(true);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true);
      setUserConsent(AdsConsentStatus.NON_PERSONALIZED);
    }, 10000);
    consentFormInit();

    return () => clearTimeout(timeout);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return isLoaded;
};

export default useAdsConsentHook;
