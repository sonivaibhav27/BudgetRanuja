import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {RecoilRoot} from 'recoil';
import {withCodePush} from './src/app/hof';
import NavigationRoot from './src/app/navigation';
import CommonStyles from './src/app/styles';

export default withCodePush(() => {
  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <StatusBar backgroundColor="#f1f1f1" barStyle="dark-content" />
      <RecoilRoot>
        <NavigationRoot />
      </RecoilRoot>
    </SafeAreaView>
  );
});
