import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useRecoilState} from 'recoil';
import {BudgetOperations} from '../../../../../database';
import {UtilTypes} from '../../../../../types';
import {
  BottomSheet,
  PressableTextButton,
  TextInput,
  Text,
} from '../../../../components';
import {BudgetState} from '../../../../state';
import {COLORS, PADDING} from '../../../../theme';
import Utils from '../../../../utils';

type Props = {
  close: () => void;
};
const {height} = Dimensions.get('window');
export default (props: Props) => {
  const bottomSheetRef = React.useRef<UtilTypes.TBottomSheetRef>(null);
  const [currentMonthBudgetAtom, setCurrentMonthBudgetInAtom] = useRecoilState(
    BudgetState.currentMonthBudgetAtom,
  );
  const [budget, setBudget] = React.useState(
    currentMonthBudgetAtom !== -1 ? `${currentMonthBudgetAtom}` : '',
  );

  const onSetBudgetPress = async () => {
    if (budget.length === 0) {
      return;
    }
    if (/^\d+$/.test(budget)) {
      await BudgetOperations.upsertBudget(+budget);
      setCurrentMonthBudgetInAtom(+budget);
    } else {
      Utils.makeToast('Only number is allowed.');
    }
  };

  return (
    <BottomSheet
      height={height * 0.45}
      close={props.close}
      ref={bottomSheetRef}>
      <View>
        <Text textType="subheading" style={styles.titleText}>
          Set Current Month Budget
        </Text>
        <TextInput
          placeholder={'Enter your budget'}
          value={budget}
          onChangeText={newBudget => setBudget(newBudget)}
          style={styles.textInput}
          keyboardType="number-pad"
        />
        <PressableTextButton
          style={styles.buttonContainer}
          onPress={onSetBudgetPress}
          text="Set Budget"
          textType="normal"
          textStyle={styles.text}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 30,
    color: COLORS.black,
  },
  textInput: {
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#444',
    marginTop: 30,
    color: COLORS.black,
    fontSize: 20,
    width: 200,
    alignSelf: 'center',
  },
  buttonContainer: {
    padding: PADDING.big,
    marginTop: 10,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.white,
  },
});
