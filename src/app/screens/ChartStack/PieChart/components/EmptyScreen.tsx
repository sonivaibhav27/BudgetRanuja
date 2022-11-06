import * as React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {PressableTextButton, Text} from '../../../../components';
import {COLORS, PADDING} from '../../../../theme';
import {Images} from '../../../../assets';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NavigationTypes} from '../../../../../types';

const {width} = Dimensions.get('window');
const SIZE = width * 0.7;
const EmptyScreen = () => {
  const navigation =
    useNavigation<
      NavigationProp<
        NavigationTypes.TRootStackScreens & NavigationTypes.TBottomTabScreens,
        'ChartStack'
      >
    >();
  return (
    <View style={styles.container}>
      <Image source={Images.emptyIconPath()} style={styles.image} />
      <Text textType="subheading" style={styles.text}>
        Create bills to show charts...
      </Text>
      <PressableTextButton
        text="Create your first Bill"
        onPress={() =>
          navigation.navigate('CreateEditScreen', {
            typeOfScreen: 'Create',
          })
        }
        textStyle={styles.createText}
        style={styles.btn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
  text: {
    color: '#000',
    marginTop: 20,
    fontWeight: '600',
    fontSize: 18,
  },
  btn: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: PADDING.big,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  createText: {
    fontSize: 18,
    color: '#FFF',
  },
});
export default EmptyScreen;
