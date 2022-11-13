import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '../../../components';
import {Icons} from '../../../helper';
import {COLORS} from '../../../theme';

const ICON_SIZE = 22;
type TabBarIconProps = {
  focused: boolean;
  tabBarName: 'HomeStack' | 'DetailStack' | 'SettingStack' | 'ChartStack';
  color: string;
  routeKey: string;
  navigation: any;
};

const {width} = Dimensions.get('window');

const GetIconClass = (type: TabBarIconProps['tabBarName']) => {
  return (props: TabBarIconProps) => {
    switch (type) {
      case 'DetailStack':
        return (
          <Icons.Entypo
            name={'documents'}
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
    outputRange: [1, 1.1, 1.2],
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
      style={[
        styles.container,
        {
          transform: [{scale}],
        },
      ]}>
      <View style={[styles.iconContainer, props.focused && styles.selected]}>
        {Icon(props)}
      </View>
      <Text
        textType={props.focused ? 'subheading' : 'normal'}
        style={[
          styles.textStyle,
          {
            color: props.focused ? COLORS.black : COLORS.mediumGray,
          },
        ]}>
        {props.tabBarName.replace(/stack/gi, '')}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  selected: {
    backgroundColor: COLORS.primary,
    width: ICON_SIZE + 10,
    height: ICON_SIZE + 10,
    borderRadius: 100,
    justifyContent: 'center',
  },
  container: {width: (width - 20) / 4, alignSelf: 'center'},
});
