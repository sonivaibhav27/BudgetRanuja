import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
type Props = any;

export default (RootComponent: Props) => {
  const RootRecoil = () => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <RecoilRoot>
          <StatusBar backgroundColor="#f1f1f1" barStyle="dark-content" />
          <RootComponent />
        </RecoilRoot>
      </SafeAreaView>
    );
  };
  return RootRecoil;
};
