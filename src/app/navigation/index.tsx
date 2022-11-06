import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import CommonStyles from '../styles';
import BottomTab from './BottomTab';

const NavigationRoot = () => {
  return (
    <View style={CommonStyles.flex1}>
      <NavigationContainer>
        <BottomTab />
      </NavigationContainer>
    </View>
  );
};

export default NavigationRoot;
