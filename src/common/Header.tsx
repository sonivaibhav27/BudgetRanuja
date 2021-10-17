import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {GlobalStyle} from '../theme&styles';
import {Icons} from '../utils';
interface Props {
  headerTitle: string;
  showBackButton: boolean;
}

const Header = (props: Props) => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {props.showBackButton && (
        <Pressable
          hitSlop={{
            top: 5,
            left: 5,
            right: 10,
            bottom: 5,
          }}
          onPress={goBack}
          style={styles.backButtonContainer}>
          <Icons.AntDesign name="arrowleft" size={20} color="#000" />
        </Pressable>
      )}
      <Text style={styles.headerTitle}>{props.headerTitle}</Text>
    </View>
  );
};

Header.defaultProps = {
  showBackButton: false,
  headerTitle: '',
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  headerTitle: {
    ...GlobalStyle.TextStyle.header,
  },
  backButtonContainer: {
    marginRight: 10,
  },
});
export default Header;
