import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {PressableButton} from '../../common';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {Icons} from '../../utils';

type Props = StackScreenProps<MainStackScreenType, 'Pricing'>;
export default (props: Props) => {
  if (props.route.params.version.includes('beta')) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Early Access </Text>
        <Text style={styles.paragraph}>
          As this is Early Access App, You can use premium feature free of cost.
          {'\n\n'}If you like our App , kindly review us at play store to
          support us.
        </Text>
        <PressableButton
          onPress={() => Alert.alert('Not Implemented')}
          style={styles.reviewContainer}>
          <Icons.Entypo name="google-play" color="#fff" size={25} />
          <Text style={styles.reviewText}>Review on Play Store</Text>
        </PressableButton>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  headerTitle: {
    fontSize: 30,
    color: '#000',
    fontWeight: '700',
    // alignSelf: 'flex-start',
    textTransform: 'uppercase',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    // textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
    color: '#333',
    fontSize: 18,
  },
  reviewContainer: {
    backgroundColor: '#02875F',
    paddingHorizontal: 15,
    marginTop: 40,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reviewText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 22,
    fontWeight: '500',
  },
});
