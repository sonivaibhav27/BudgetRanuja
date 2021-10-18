import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useRecoilValue} from 'recoil';
import {UtilsAtom} from '../../../State';

type Props = {
  text: string;
  background: string;
  amount: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Section = ({text, background, amount, style, textStyle}: Props) => {
  React.useEffect(() => {}, [amount]);
  return (
    <View
      style={[{backgroundColor: background}, styles.sectionContainer, style]}>
      <Text style={[styles.commonTextStyle, textStyle]}>{text}</Text>
      <Text style={[styles.commonTextStyle, textStyle]}>{amount}</Text>
    </View>
  );
};

export default () => {
  const currentTheme = useRecoilValue(UtilsAtom.ThemeAtom);
  return (
    <View>
      <Section
        text="budget"
        background={currentTheme.backgroundBanner}
        amount={'20000'}
      />
      <Section
        text="Actual "
        background={currentTheme.primary}
        amount={'400'}
        textStyle={{color: '#fff'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: 20,
    padding: 10,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 7,
  },
  commonTextStyle: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
