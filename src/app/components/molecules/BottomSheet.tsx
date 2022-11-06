import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import {PressableTextButton} from '.';
import {UtilTypes} from '../../../types';
import {COLORS} from '../../theme';
import {Overlay} from '../atoms';

interface BottomSheetProps {
  close: () => void;
  children: JSX.Element | JSX.Element[];
  height?: number;
}
const {height} = Dimensions.get('window');
const BottomSheet = React.forwardRef<
  UtilTypes.TBottomSheetRef,
  BottomSheetProps
>((props, forwardRef) => {
  const ref = React.useRef(new Animated.Value(0)).current;

  React.useImperativeHandle(
    forwardRef,
    () => {
      return {
        close: () => toggleAnimation(0, true),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    toggleAnimation(1);
    const r = BackHandler.addEventListener('hardwareBackPress', () => {
      toggleAnimation(0, true);
      return true;
    });
    return () => {
      r.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = ref.interpolate({
    inputRange: [0, 1],
    outputRange: [props.height!, 0],
    extrapolate: 'clamp',
  });

  const toggleAnimation = (v: number, callCloseCallback = false) => {
    Animated.timing(ref, {
      toValue: v,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
      duration: 200,
    }).start(() => {
      if (callCloseCallback) {
        props.close();
      }
    });
  };

  return (
    <Overlay>
      <Animated.View
        style={[
          styles.container,
          {height: props.height, transform: [{translateY}]},
        ]}>
        <PressableTextButton
          style={styles.left}
          text="&#x2715;"
          onPress={() => toggleAnimation(0, true)}
          textStyle={styles.crossText}
        />
        {/* <Pressable onPress={() => toggleAnimation(0, true)} style={styles.left}>
          <Icons.Entypo color={COLORS.darkGray} size={25} name="cross" />
        </Pressable> */}
        {props.children}
      </Animated.View>
    </Overlay>
  );
});

BottomSheet.defaultProps = {
  height: height / 2,
};
const styles = StyleSheet.create({
  container: {
    zIndex: 10001,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  left: {
    alignSelf: 'flex-end',
    right: 20,
    top: 10,
  },
  crossText: {
    fontSize: 28,
  },
});

export default BottomSheet;
