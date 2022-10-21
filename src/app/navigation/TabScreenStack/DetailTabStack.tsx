import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen} from '../../../screens';
import DetailAboutOneCategory from '../../../screens/DetailAboutOneCategory';
import {NavigationTypes} from '../../../types';

const Stack = createStackNavigator<NavigationTypes.TDetailStackScreen>();
export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Detail"
        component={DetailScreen}
      />
      <Stack.Screen
        name="DetailAboutOneCategory"
        component={DetailAboutOneCategory}
      />
    </Stack.Navigator>
  );
};
