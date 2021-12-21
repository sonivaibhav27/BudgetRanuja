import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import {Icons} from '../../../utils';
import {GlobalStyle} from '../../../theme&styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackScreenType} from '../../../navigations/MainStack/types';

export default () => {
  const theme = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<MainStackScreenType, 'Home'>>();

  const navigateToSettingScreen = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appNameText}>Budjet</Text>
      <Pressable
        onPress={navigateToSettingScreen}
        hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
        style={styles.iconContainer}>
        <Icons.AntDesign name="setting" size={30} color={theme.colors.text} />
      </Pressable>
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
    fontSize: 18,
  },
});
