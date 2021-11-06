import {ToastAndroid} from 'react-native';

export default (message: 'string', duration: 'SHORT' | 'LONG' = 'SHORT') => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid[duration],
    ToastAndroid.BOTTOM,
    0,
    20,
  );
};
