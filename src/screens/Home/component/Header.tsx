import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Icons} from '../../../utils';
import {GlobalStyle} from '../../../theme&styles';

export default () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.appNameText}>Budget</Text>
      <View style={styles.iconContainer}>
        <Icons.AntDesign name="setting" size={30} color={theme.colors.text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  appNameText: {
    textAlign: 'center',
    ...GlobalStyle.TextStyle.h1,
    color: '#000',
  },
});
