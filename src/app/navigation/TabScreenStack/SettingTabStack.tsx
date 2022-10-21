import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ReportScreen, SettingsScreen} from '../../../screens';
import {NavigationTypes} from '../../../types';

const Stack = createStackNavigator<NavigationTypes.TSettingStackScreen>();
export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen name="Report" component={ReportScreen} />
    </Stack.Navigator>
  );
};
