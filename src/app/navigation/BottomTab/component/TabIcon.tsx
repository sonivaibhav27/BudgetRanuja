import React from 'react';
import {Animated, Easing, TouchableOpacity} from 'react-native';
import {Icons} from '../../../helper';

const ICON_SIZE = 24;
type TabBarIconProps = {
  focused: boolean;
  tabBarName: 'HomeStack' | 'DetailStack' | 'SettingStack' | 'ChartStack';
  color: string;
  routeKey: string;
  navigation: any;
};

const GetIconClass = (type: TabBarIconProps['tabBarName']) => {
  return (props: TabBarIconProps) => {
    switch (type) {
      case 'DetailStack':
        return (
          <Icons.Ionicons
            name={'receipt'}
            size={ICON_SIZE}
            color={props.color}
          />
        );
      case 'HomeStack':
        return (
          <Icons.Foundation
            name={'home'}
            size={ICON_SIZE}
            color={props.color}
          />
        );
      case 'ChartStack':
        return (
          <Icons.Ionicons
            name={'pie-chart'}
            size={ICON_SIZE}
            color={props.color}
          />
        );
      case 'SettingStack':
        return (
          <Icons.Ionicons
            name="md-settings-sharp"
            size={ICON_SIZE}
            color={props.color}
          />
        );
    }
  };
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
export default (props: TabBarIconProps) => {
  const animated = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: props.focused ? 2 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animated, {
        toValue: props.focused ? 1 : 0,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  }, [props.focused, animated]);
  const Icon = GetIconClass(props.tabBarName);
  const scale = animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1.2, 1.4],
    extrapolate: 'clamp',
  });

  const onPress = () => {
    const event = props.navigation.emit({
      type: 'tabPress',
      target: props.routeKey,
    });
    if (!props.focused && !event.defaultPrevented) {
      props.navigation.navigate({name: props.tabBarName, merge: true});
    }
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      hitSlop={{
        top: 5,
        left: 8,
        right: 8,
        bottom: 5,
      }}
      onPress={onPress}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        transform: [{scale}],
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      {Icon(props)}
    </AnimatedTouchableOpacity>
  );
};
