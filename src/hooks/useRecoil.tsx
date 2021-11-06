import Database from '@nozbe/watermelondb/Database';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
type Props = any;

type props = {
  database: Database;
};

export default (RootComponent: Props) => {
  const RootRecoil = props => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <RecoilRoot>
          <StatusBar backgroundColor="#f1f1f1" barStyle="dark-content" />
          <RootComponent database={props.database} />
        </RecoilRoot>
      </SafeAreaView>
    );
  };
  return RootRecoil;
};
