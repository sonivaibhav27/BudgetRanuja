import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const IMAGE_SIZE = 150;
export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Image
          style={{width: IMAGE_SIZE, height: IMAGE_SIZE}}
          source={require('../assets/images/Icon.png')}
        />
      </View>
    </View>
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
});
