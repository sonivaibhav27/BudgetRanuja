import React from 'react';
import {View, StyleSheet, Image, Text, ActivityIndicator} from 'react-native';

const IMAGE_SIZE = 150;
export default () => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Image
            style={[styles.logo, {width: IMAGE_SIZE, height: IMAGE_SIZE}]}
            source={require('../assets/images/Icon.png')}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
            {/* <Text style={styles.loadingText}>Loading ...</Text> */}
          </View>
        </View>
        <View style={styles.appNameContainer}>
          <Text style={styles.appName}>Budjet</Text>
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
  icon: {
    borderRadius: 8,
  },
  logo: {
    borderRadius: 15,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    marginTop: 5,
  },
  appNameContainer: {
    position: 'absolute',
    bottom: 20,
  },
  appName: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '700',
    fontSize: 22,
    textTransform: 'uppercase',
  },
});
