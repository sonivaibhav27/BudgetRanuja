import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackScreenType} from './types';
import {DetailScreen, HomeScreen, CreateScreen} from '../../screens';
const Stack = createStackNavigator<MainStackScreenType>();

export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          left: -15,
        },
      }}>
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#EEEEEE',
          },
        }}
        name="Detail"
        component={DetailScreen}
      />
      <Stack.Screen
        options={({route}) => ({
          headerTitle: `Create ${route.params.comingFrom}`,
        })}
        name="Create"
        component={CreateScreen}
      />
    </Stack.Navigator>
  );
};
