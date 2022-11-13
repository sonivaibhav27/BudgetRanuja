import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  BackHandler,
} from 'react-native';
import Text from '../atoms/Text';
import {PressableIconButton} from '.';
import {UtilTypes} from '../../../types';

const {height} = Dimensions.get('window');

type Props = {
  onModalClose: () => void;
  title: string;
  data?: string[];
  children: JSX.Element | JSX.Element[];
  isCurrentScreenFocused: boolean;
};

export default React.forwardRef<UtilTypes.TFullScreenModalRef, Props>(
  (props, ref) => {
    const animate = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      Animated.timing(animate, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      const backHander = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (props.isCurrentScreenFocused) {
            _closeModal();
            return true;
          }
          return false;
        },
      );
      return () => {
        backHander.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isCurrentScreenFocused]);
    React.useImperativeHandle(
      ref,
      () => {
        return {
          close: cb => _closeModal(cb),
        };
      },
      //eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const _closeModal = (cb?: () => void) => {
      Animated.timing(animate, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(() => {
        if (typeof cb === 'function') {
          cb();
        }
      });
    };

    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            transform: [
              {
                translateY: animate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
          styles.container,
        ]}>
        <View style={styles.header}>
          <Text textType="heading" style={styles.headerText}>
            {props.title}
          </Text>
          <View style={styles.crossButtonContainer}>
            <PressableIconButton
              style={styles.closeButton}
              onPress={() => _closeModal(props.onModalClose)}
              iconName="cross"
              iconFamily="Entypo"
            />
          </View>
        </View>
        {props.children}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    zIndex: 1000,
  },
  closeButton: {
    borderWidth: 0,
    marginBottom: 0,
    paddingHorizontal: 0,
    flex: 0,
  },
  crossButtonContainer: {
    backgroundColor: 'rgba(255, 200, 150,.1)',
    borderRadius: 100,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    // marginLeft: 30,
    top: 2,
    fontSize: 20,
  },
  header: {
    position: 'relative',
    // elevation: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
