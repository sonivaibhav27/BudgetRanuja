import {Alert} from 'react-native';

export default (title: string, message: string, onOkPress: () => void) => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
    },
    {text: 'Ok', onPress: onOkPress},
  ]);
};
