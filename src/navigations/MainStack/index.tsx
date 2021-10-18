import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackScreenType} from './types';
import {
  DetailScreen,
  HomeScreen,
  CreateScreen,
  SettingsScreen,
  DetailAboutOneCategoryScreen,
} from '../../screens';
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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="DetailAboutOneCategory"
        component={DetailAboutOneCategoryScreen}
      />
    </Stack.Navigator>
  );
};
