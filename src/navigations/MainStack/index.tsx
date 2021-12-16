import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackScreenType} from './types';
import {
  DetailScreen,
  HomeScreen,
  CreateScreen,
  SettingsScreen,
  DetailAboutOneCategoryScreen,
  PricingScreen,
  PieChartScreen,
  EditCategoryScreen,
} from '../../screens';
import {Text, View, useWindowDimensions} from 'react-native';
import {useInitialDataOnAppLaunch} from '../../hooks';
const Stack = createStackNavigator<MainStackScreenType>();

export default () => {
  const {width} = useWindowDimensions();
  const getDataLoadingState = useInitialDataOnAppLaunch();
  if (getDataLoadingState) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      // initialRouteName="PieChart"
      screenOptions={{
        headerTitleStyle: {
          left: -15,
        },
        headerStyle: {
          elevation: 1,
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
          headerTitle: `${route.params.screenType || ''} ${
            route.params.comingFrom || ''
          }`,
        })}
        name="Create"
        component={CreateScreen}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="DetailAboutOneCategory"
        component={DetailAboutOneCategoryScreen}
        options={({route}) => {
          return {
            headerTitle: route.params.categoryName || '',
            headerTitleStyle: {
              maxWidth: width * 0.35,
              left: -20,
            },
          };
        }}
      />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen
        name="PieChart"
        options={{headerTitle: 'Graph'}}
        component={PieChartScreen}
      />
      <Stack.Screen
        options={{title: 'Add/Edit'}}
        name="EditCategory"
        component={EditCategoryScreen}
      />
    </Stack.Navigator>
  );
};
