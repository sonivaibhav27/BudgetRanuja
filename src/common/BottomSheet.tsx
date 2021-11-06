import React from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  View,
  Text,
} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {BudgetOperations} from '../database';
import {BudgetAtom} from '../State/Atoms';
import {GlobalStyle, Theme} from '../theme&styles';
import Dayjs from '../utils/dayjs';
import Input from './Input';

const {height} = Dimensions.get('window');

const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface Props {
  closeBottomSheet: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const CurrentMonth =
  Months[+Dayjs.getCurrentMonthAndYear().toString().slice(0, 2) - 1];
export default (props: Props) => {
  const [budget, setBudget] = React.useState('');
  const setCurrentMonthBudgetInAtom = useSetRecoilState(
    BudgetAtom.currentMonthBudget,
  );
  const animRef = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [animRef]);
  const animatedStyle = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
    extrapolate: 'clamp',
  });

  React.useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      Animated.timing(animRef, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => props.closeBottomSheet());

      return true;
    });
    return () => {
      handler.remove();
    };
  }, []);

  const onSetBudgetPress = async () => {
    alert('re');
    return;
    if (budget.length === 0) {
      return;
    }
    if (budget.indexOf('.') !== -1) {
      return;
    }
    if (/^\d+$/.test(budget)) {
      await BudgetOperations.upsertBudget(
        +budget,
        +Dayjs.getCurrentMonthAndYear(),
      );
      setCurrentMonthBudgetInAtom(+budget);
    }
  };

  return (
    <AnimatedPressable
      activeOpacity={0.9}
      onPress={props.closeBottomSheet}
      style={[
        StyleSheet.absoluteFillObject,
        {
          opacity: animRef.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
        styles.container,
      ]}>
      <Animated.View
        onStartShouldSetResponder={event => true}
        onTouchEnd={e => {
          e.stopPropagation();
        }}
        style={[
          styles.innerContainer,
          {transform: [{translateY: animatedStyle}]},
        ]}>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Your {CurrentMonth} Budget</Text>
          <Input
            value={budget}
            onChangeText={newBudget => setBudget(newBudget)}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={onSetBudgetPress}
            style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Set</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  innerContainer: {
    height: height / 2,
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    elevation: 3,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 0.9,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    ...GlobalStyle.GlobalCommonStyles.textStyle,
    fontSize: 30,
    textAlign: 'center',
    marginHorizontal: 30,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#444',
    marginTop: 20,
    color: '#000',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  buttonContainer: {
    backgroundColor: Theme.ColorsTheme.primary,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
});
