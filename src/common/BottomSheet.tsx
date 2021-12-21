import React from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  View,
  Text,
  BackHandler,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {useRecoilState} from 'recoil';
import {BudgetOperations} from '../database';
import {BudgetAtom} from '../State/Atoms';
import {GlobalStyle, Theme} from '../theme&styles';
import {DayJs, Toast} from '../utils';
import Input from './Input';
import PressableButton from './PressableButton';

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
  Months[+DayJs.getCurrentYearAndMonth().toString().slice(4)];

console.log({
  CurrentMonth: DayJs.getCurrentYearAndMonth(),
});
export default (props: Props) => {
  const [currentMonthBudgetAtom, setCurrentMonthBudgetInAtom] = useRecoilState(
    BudgetAtom.currentMonthBudget,
  );
  const [budget, setBudget] = React.useState(
    currentMonthBudgetAtom !== -1 ? `${currentMonthBudgetAtom}` : '',
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetBudgetPress = async () => {
    if (budget.length === 0) {
      return;
    }
    if (/^\d+$/.test(budget)) {
      await BudgetOperations.upsertBudget(+budget);
      setCurrentMonthBudgetInAtom(+budget);
      Animated.timing(animRef, {
        toValue: 0,
        duration: 250,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        Keyboard.dismiss();
      });
    } else {
      Toast('Only number is allowed.');
    }
  };

  return (
    <AnimatedPressable
      activeOpacity={1}
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
        style={[
          styles.innerContainer,
          {transform: [{translateY: animatedStyle}]},
        ]}>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Your {CurrentMonth} Budget</Text>
          <Input
            placeholder={'Enter your budget'}
            value={budget}
            onChangeText={newBudget => setBudget(newBudget)}
            style={styles.textInput}
          />
          <PressableButton
            onPress={onSetBudgetPress}
            style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Set</Text>
          </PressableButton>
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
    height: height / 2.3,
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
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 30,
    fontFamily: GlobalStyle.Font.SemiBold,
  },
  textInput: {
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#444',
    marginTop: 20,
    color: '#000',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    width: 200,
    alignSelf: 'center',
  },
  buttonContainer: {
    backgroundColor: Theme.ColorsTheme.primary,
    padding: 8,
    marginTop: 10,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
});
