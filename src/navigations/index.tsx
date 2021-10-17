import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MainStack from './MainStack';
import {Theme} from '../theme&styles';

export default () => {
  return (
    <NavigationContainer theme={Theme.Colors_Dark}>
      <MainStack />
    </NavigationContainer>
  );
};
