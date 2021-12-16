import {ToastAndroid} from 'react-native';

export default (message: string, duration: 'SHORT' | 'LONG' = 'LONG') => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid[duration],
    ToastAndroid.BOTTOM,
    0,
    20,
  );
};
