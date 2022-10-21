import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CreateScreen, HomeScreen} from '../../../screens';
import {NavigationTypes} from '../../../types';

const Stack = createStackNavigator<NavigationTypes.THomeStackScreen>();
export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="CreateBill"
        options={{
          headerTitle: 'Create',
          headerStyle: {
            borderBottomWidth: 0,
            elevation: 0.2,
          },
        }}
        component={CreateScreen}
      />
    </Stack.Navigator>
  );
};
