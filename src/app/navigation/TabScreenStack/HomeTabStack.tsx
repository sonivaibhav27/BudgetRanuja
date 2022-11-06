import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '../../../types';
import {HomeScreen} from '../../screens';

const Stack = createStackNavigator<NavigationTypes.THomeStackScreen>();
export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
};
