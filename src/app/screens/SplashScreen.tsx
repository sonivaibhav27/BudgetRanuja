import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Images} from '../assets';
import {Text} from '../components';

const IMAGE_SIZE = 150;
export default () => {
  return (
    <>
      <View style={styles.container}>
        <View>
          <Image
            style={[styles.logo, {width: IMAGE_SIZE, height: IMAGE_SIZE}]}
            source={Images.appIconPath()}
          />
        </View>
        <View style={styles.appNameContainer}>
          <Text textType="subheading" style={styles.appName}>
            Budjet
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  logo: {
    borderRadius: 4,
  },
  appNameContainer: {
    position: 'absolute',
    bottom: 20,
  },
  appName: {
    textAlign: 'center',
    color: '#000',
    fontSize: 22,
    textTransform: 'uppercase',
  },
});
