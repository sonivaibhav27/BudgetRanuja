import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MainStack from './MainStack';
import {Theme} from '../theme&styles';

const App = () => {
  return (
    <NavigationContainer theme={Theme.Colors_Dark}>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
