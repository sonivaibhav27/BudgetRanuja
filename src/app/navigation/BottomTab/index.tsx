import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CreateEditScreen, PieChartScreen, SplashScreen} from '../../screens';
import {BottomTabBar} from './component';
import {DetailTabStack, HomeTabStack, SettingTabStack} from '../TabScreenStack';
import {NavigationTypes} from '../../../types';
import useStartupData from '../../startup';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackImage, HeaderSubScreenTitle} from '../common';
import {COLORS} from '../../theme';

const BottomTab = createBottomTabNavigator<NavigationTypes.TBottomTabScreens>();
const RootStack = createStackNavigator<NavigationTypes.TRootStackScreens>();

const BottomTabNavigation = () => (
  <BottomTab.Navigator
    tabBar={props => <BottomTabBar {...props} />}
    screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: {
        elevation: 1,
      },
      tabBarActiveTintColor: COLORS.darkGray,
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
    <BottomTab.Screen name="DetailStack" component={DetailTabStack} />
    <BottomTab.Screen name="ChartStack" component={PieChartScreen} />
    <BottomTab.Screen
      name="SettingStack"
      options={{
        //for loading settings on initial render so that clicking on Add category works.
        lazy: false,
      }}
      component={SettingTabStack}
    />
  </BottomTab.Navigator>
);
export default () => {
  const isLoading = useStartupData();
  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        options={{headerShown: false}}
        name="BottomTabBarScreen"
        component={BottomTabNavigation}
      />
      <RootStack.Screen
        options={({route}) => ({
          headerBackImage: ({tintColor}) => (
            <HeaderBackImage tintColor={tintColor} />
          ),
          headerTitle: () => (
            <HeaderSubScreenTitle title={route.params.typeOfScreen + ' Bill'} />
          ),
        })}
        name="CreateEditScreen"
        component={CreateEditScreen}
      />
    </RootStack.Navigator>
  );
};
