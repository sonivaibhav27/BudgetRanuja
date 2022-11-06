import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Pressable, Text} from '../../../../components';
import {Icons} from '../../../../helper';
import {COLORS} from '../../../../theme';

export default ({
  onPress,
  btnHeight,
}: {
  onPress: () => void;
  btnHeight: number;
}) => {
  return (
    <View style={styles.main}>
      <Pressable
        onPress={onPress}
        style={[styles.container, {height: btnHeight}]}>
        <Icons.Entypo name="circle-with-plus" color="#FFF" size={25} />
        <Text textType="normal" style={styles.addnewtext}>
          Add new
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'red',
    width: 170,
    borderRadius: 100,
    marginBottom: 15,
    overflow: 'hidden',
    alignSelf: 'center',
    zIndex: -10,
  },
  container: {
    borderWidth: 2,
    borderColor: '#C7C8D6',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 100,
    justifyContent: 'center',
  },
  addnewtext: {
    fontSize: 18,
    color: '#FFF',
    marginLeft: 10,
  },
});
