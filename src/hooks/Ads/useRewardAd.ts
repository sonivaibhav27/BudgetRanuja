import {
  GoogleAdsTypes,
  RewardedAd,
  RewardedAdEventType,
} from '@invertase/react-native-google-ads';
import {Toast} from '../../utils';

const rewarded = RewardedAd.createForAdRequest(
  'ca-app-pub-3940256099942544/5224354917',
  {
    requestNonPersonalizedAdsOnly: false,
  },
);

const RewardAds: () => [
  (rewardedAdsInstance: GoogleAdsTypes.RewardedAd) => void,
  (
    rewardedAdsInstance: GoogleAdsTypes.RewardedAd,
    success: () => void,
    commonFunction: () => void,
    closeAd: () => void,
    onErrorCallback: () => void,
  ) => Function,
  GoogleAdsTypes.RewardedAd,
] = () => {
  // const [
  //   isWatchedAdSuccessfullyAndDismissed,
  //   setIsWatchedAdSuccessfullyAndDismissed,
  // ] = React.useState(false);

  // const rewardedRef = React.useRef(false);
  const setupEventHanlders = (
    rewardedInstance: GoogleAdsTypes.RewardedAd,
    onSuccessCallback: () => void,
    commonFunction: () => void,
    closeAd: () => void,
    onErrorCallback: () => void,
  ) => {
    const event = rewardedInstance.onAdEvent((type, error) => {
      if (error) {
        Toast('Error in showing ad' + error.message);
        commonFunction();
        onErrorCallback();
        return;
      }
      if (type === RewardedAdEventType.LOADED) {
        rewardedInstance.show();
      } else if (type === 'rewarded_earned_reward') {
        onSuccessCallback();
      } else if (type === 'closed') {
        closeAd();
      }
      commonFunction();
    });
    return event;
  };
  const loadAd = (rewardedInstance: GoogleAdsTypes.RewardedAd) => {
    try {
      // setIsWatchedAdSuccessfullyAndDismissed(false);
      rewardedInstance.load();
    } catch (err) {
      Toast('Error in loading Ad ');
    }
  };

  // React.useEffect(() => {
  //   const event = newEvent();
  //   return () => event();
  // }, []);

  return [loadAd, setupEventHanlders, rewarded];
};

export default RewardAds;

// const RewardAds: () => [Function, boolean] = () => {
//   const [
//     isWatchedAdSuccessfullyAndDismissed,
//     setIsWatchedAdSuccessfullyAndDismissed,
//   ] = React.useState(false);

//   const rewardedRef = React.useRef(false);

//   const newEvent = () => {
//     const event = rewarded.onAdEvent((type, error) => {
//       if (error) {
//         Toast('Error in showing ad' + error.message);
//         rewardedRef.current = false;
//         setIsWatchedAdSuccessfullyAndDismissed(false);
//         return;
//       }
//       if (type === RewardedAdEventType.LOADED) {
//         rewarded.show();
//       } else if (type === 'rewarded_earned_reward') {
//         rewardedRef.current = true;
//       } else if (type === 'closed') {
//         console.log({
//           rewardedRef,
//         });
//         if (rewardedRef.current) {
//           setIsWatchedAdSuccessfullyAndDismissed(true);
//         }
//         rewardedRef.current = false;
//       }
//     });
//     return event;
//   };
//   const loadAd = () => {
//     try {
//       setIsWatchedAdSuccessfullyAndDismissed(false);
//       rewarded.load();
//     } catch (err) {
//       Toast('Error in loading Ad ');
//     }
//   };

//   React.useEffect(() => {
//     const event = newEvent();
//     return () => event();
//   }, []);

//   return [loadAd, isWatchedAdSuccessfullyAndDismissed];
// };

//export default RewardAds;
