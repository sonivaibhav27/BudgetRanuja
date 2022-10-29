import {StyleSheet} from 'react-native';

const CommonStyles = StyleSheet.create({
  flex1: {flex: 1, backgroundColor: '#FFFFFF'},
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommonStyles;
