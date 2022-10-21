import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PieChartScreen, SplashScreen} from '../../../screens';
import {BottomTabBar} from './component';
import {DetailTabStack, HomeTabStack, SettingTabStack} from '../TabScreenStack';
import {useInitialDataOnAppLaunch} from '../../../hooks';
import {NavigationTypes} from '../../../types';

const BottomTab = createBottomTabNavigator<NavigationTypes.TBottomTabScreens>();

export default () => {
  const getDataLoadingState = useInitialDataOnAppLaunch();
  if (getDataLoadingState) {
    return <SplashScreen />;
  }
  return (
    <BottomTab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 1,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#777',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 22,
          textTransform: 'uppercase',
        },
        headerShown: false,
      }}>
      <BottomTab.Screen
        options={{
          headerShown: false,
        }}
        name="HomeStack"
        component={HomeTabStack}
      />
      <BottomTab.Screen name="BillDetailStack" component={DetailTabStack} />
      <BottomTab.Screen options={{}} name="Chart" component={PieChartScreen} />
      <BottomTab.Screen name="SettingStack" component={SettingTabStack} />
    </BottomTab.Navigator>
  );
};
