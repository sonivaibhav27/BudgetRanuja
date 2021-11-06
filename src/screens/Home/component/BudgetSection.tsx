import React, {ReactElement} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useRecoilValue} from 'recoil';
import {PressableButton} from '../../../common';
import {UtilsAtom} from '../../../State';
import {BudgetAtom} from '../../../State/Atoms';
import {Theme} from '../../../theme&styles';
import {Icons} from '../../../utils';

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
        <View style={styles.itemContainer}>
          <Text style={[styles.commonTextStyle, textStyle]}>{amount}</Text>
          {typeof children !== 'undefined' ? children : null}
        </View>
      </PressableButton>
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
        amount={currentBudgetAmount === -1 ? 'Not set' : currentBudgetAmount}>
        <View style={styles.iconContainer}>
          <Icons.AntDesign name="edit" color="#000" size={16} />
        </View>
      </Section>
      {/* <Section
        text="Actual"
        background={'#A35E00'}
        amount={'$400'}
        textStyle={{color: '#fff', fontWeight: 'bold'}}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'center',
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
    // height: 50,
  },
  commonTextStyle: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  iconContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
