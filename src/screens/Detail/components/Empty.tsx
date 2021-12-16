import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GlobalStyle} from '../../../theme&styles';

function EmptyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No bills found .</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 16, color: '#000', fontFamily: GlobalStyle.Font.SemiBold},
});
export default EmptyScreen;
