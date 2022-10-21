import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import TabIcon from './TabIcon';

const {width: DEVICE_WIDTH} = Dimensions.get('window');
export default (props: BottomTabBarProps) => {
  const selectedRoute = props.state.routeNames[props.state.index];
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-around',
    width: DEVICE_WIDTH * 1,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    elevation: 1,
    borderTopWidth: 0.3,
    borderTopColor: 'rgba(221, 221, 221,0.4)',
  },
});
