import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {useRecoilValue} from 'recoil';
import {UtilsAtom} from '../../../State';

export default ({onPress}: {onPress: () => void}) => {
  const colorTheme = useRecoilValue(UtilsAtom.ThemeAtom);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, {backgroundColor: colorTheme.primary}]}>
      <Text style={styles.textStyle}>Go to Detail</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: '#F5951E',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
