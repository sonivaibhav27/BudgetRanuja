import React, {ReactElement} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useRecoilValue} from 'recoil';
import {PressableButton} from '../../../common';
import {UtilsAtom} from '../../../State';
import {BudgetAtom} from '../../../State/Atoms';

type Props = {
  text: string;
  background: string;
  amount: string | number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactElement;
  onPress?: () => void;
};

const Section = ({
  text,
  background,
  amount,
  style,
  textStyle,
  children,
  onPress,
}: Props) => {
  React.useEffect(() => {}, [amount]);
  return (
    <>
      <PressableButton
        onPress={typeof onPress === 'function' ? onPress : () => {}}
        style={[{backgroundColor: background}, styles.sectionContainer, style]}>
        <Text style={[styles.commonTextStyle, textStyle]}>{text}</Text>
        <Text style={[styles.commonTextStyle, textStyle]}>{amount}</Text>
      </PressableButton>
      {typeof children !== 'undefined' && children}
    </>
  );
};

interface BudgetSectionProps {
  toggleBottomSheet: () => void;
}
export default (props: BudgetSectionProps) => {
  const currentTheme = useRecoilValue(UtilsAtom.ThemeAtom);
  const currentBudgetAmount = useRecoilValue(BudgetAtom.currentMonthBudget);
  return (
    <View style={styles.container}>
      <Section
        onPress={props.toggleBottomSheet}
        text="budget"
        background={currentTheme.backgroundBanner}
        amount={currentBudgetAmount === -1 ? 'Not set' : currentBudgetAmount}
      />
      <Section
        text="Actual"
        background={'#A35E00'}
        amount={'$400'}
        textStyle={{color: '#fff', fontWeight: 'bold'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    marginHorizontal: 20,
    padding: 10,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 7,
    flex: 0.5,
    height: 50,
  },
  commonTextStyle: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  editIconContainer: {
    // position: 'absolute',
    // right: -10,
    // bottom: -10,
    // backgroundColor: '#EEE',
    // padding: 10,
    // borderRadius: 100,
  },
});
