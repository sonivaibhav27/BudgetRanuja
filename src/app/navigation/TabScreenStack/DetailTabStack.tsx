import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '../../../types';
import {
  DetailScreen,
  DetailAboutOneCategory,
  ReportScreen,
} from '../../screens';
import {HeaderBackImage, HeaderSubScreenTitle} from '../common';

const Stack = createStackNavigator<NavigationTypes.TDetailStackScreen>();
export default () => {
  return (
    <Stack.Navigator initialRouteName="Detail">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Detail"
        component={DetailScreen}
      />
      <Stack.Screen
        options={({route}) => ({
          headerBackImage: ({tintColor}) => (
            <HeaderBackImage tintColor={tintColor} />
          ),
          headerTitle: () => (
            <HeaderSubScreenTitle title={route.params.categoryName || ''} />
          ),
        })}
        name="DetailAboutOneCategory"
        component={DetailAboutOneCategory}
      />
      <Stack.Screen
        options={() => ({
          headerBackImage: ({tintColor}) => (
            <HeaderBackImage tintColor={tintColor} />
          ),
          headerTitle: () => <HeaderSubScreenTitle title={'Reports'} />,
        })}
        name="Report"
        component={ReportScreen}
      />
    </Stack.Navigator>
  );
};
