import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {MainStackScreenType} from '../navigations/MainStack/types';
import {GlobalStyle} from '../theme&styles';
import {Icons} from '../utils';
import PressableButton from './PressableButton';

const {height} = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<MainStackScreenType, 'Settings'>;
  closeModal: (
    typeOfScreen: 'Currency' | 'Categories' | 'Delete Bills',
  ) => void;
  title: string;
  data?: string[];
  children: JSX.Element | JSX.Element[];
};

export default (props: Props) => {
  const animate = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animate, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
    setTimeout(() => {
      props.navigation.setOptions({
        headerShown: false,
      });
    }, 100);
  }, [animate, props.navigation]);

  const _closeModal = () => {
    Animated.timing(animate, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      props.closeModal('Categories');
    });
    props.navigation.setOptions({
      headerShown: true,
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
        <View style={styles.crossButtonContainer}>
          <PressableButton onPress={_closeModal}>
            <View>
              <Icons.Entypo name="cross" size={25} color="#444" />
            </View>
          </PressableButton>
        </View>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  crossButtonContainer: {
    padding: 6,
    borderRadius: 100,
    backgroundColor: '#EFEFEF',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  headerText: {
    ...GlobalStyle.TextStyle.header,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 60,
    elevation: 2,
    backgroundColor: 'white',
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
});
