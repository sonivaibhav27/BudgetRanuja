import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '../../../types';
import {SettingsScreen, EditScreen} from '../../screens';
import {HeaderBackImage, HeaderSubScreenTitle} from '../common';
const Stack = createStackNavigator<NavigationTypes.TSettingStackScreen>();
export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        options={() => ({
          headerBackImage: ({tintColor}) => (
            <HeaderBackImage tintColor={tintColor} />
          ),
          headerTitle: () => <HeaderSubScreenTitle title={'Edit'} />,
        })}
        name="Edit"
        component={EditScreen}
      />
    </Stack.Navigator>
  );
};
