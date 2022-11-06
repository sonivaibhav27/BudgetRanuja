import React from 'react';
import {View, StyleSheet, ActivityIndicator, Animated} from 'react-native';
import CommonStyles from '../../styles';
import {COLORS, PADDING} from '../../theme';
import Text from './Text';

type Props = {
  loadingText?: string;
  show: boolean;
  backdropColor?: string;
};

export default (props: Props) => {
  const animatedRef = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (props.show) {
      Animated.timing(animatedRef, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [props.show, animatedRef]);
  if (!props.show) {
    return null;
  }
  const opacity = animatedRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View
      style={[
        styles.wrapper,
        {opacity},
        typeof props.backdropColor !== 'undefined' && {
          backgroundColor: props.backdropColor,
        },
      ]}>
      <View style={styles.container}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text textType="paragraph" style={styles.loadingText}>
          {props.loadingText || 'Loading...'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...(StyleSheet.absoluteFill as {}),
    ...CommonStyles.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: PADDING.big,
    borderRadius: 2,
    alignSelf: 'center',
  },
  loadingText: {
    color: '#000',
    marginLeft: 20,
    fontFamily: 'Roboto',
  },
});
