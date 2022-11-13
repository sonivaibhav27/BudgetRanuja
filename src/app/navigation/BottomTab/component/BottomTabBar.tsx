import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../../theme';
import TabIcon from './TabIcon';

export default (props: BottomTabBarProps) => {
  const selectedRoute = props.state.routeNames[props.state.index];
  return (
    <View style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        {props.state.routes.map(route => {
          const options = props.descriptors[route.key].options;
          return (
            <TabIcon
              color={
                selectedRoute === route.name
                  ? options.tabBarActiveTintColor!
                  : options.tabBarInactiveTintColor!
              }
              routeKey={route.key}
              navigation={props.navigation}
              key={route.key}
              tabBarName={route.name as any}
              focused={selectedRoute === route.name}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 0.3,
    borderTopColor: 'rgba(221, 221, 221,0.4)',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    elevation: 40,
    marginTop: 5,
  },
});
