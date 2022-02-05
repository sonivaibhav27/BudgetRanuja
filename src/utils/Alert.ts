import {Alert} from 'react-native';

export default (
  title: string,
  message: string,
  onOkPress: () => void,
  showCancel: boolean = true,
) => {
  Alert.alert(title, message, [
    {
      text: showCancel ? 'Cancel' : '',
    },
    {text: 'Ok', onPress: onOkPress},
  ]);
};
