import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  FlatList,
} from 'react-native';
import {MainStackScreenType} from '../navigations/MainStack/types';
import {GlobalStyle} from '../theme&styles';
import {Icons} from '../utils';
import PressableButton from './PressableButton';

const {height} = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<MainStackScreenType, 'Settings'>;
  closeModal: () => void;
  title: string;
  data: string[];
};

export default (props: Props) => {
  const animate = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animate, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
    setTimeout(() => {
      props.navigation.setOptions({
        headerShown: false,
      });
    }, 100);
  }, [animate, props.navigation]);

  const _closeModal = () => {
    Animated.timing(animate, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      props.closeModal();
    });
    props.navigation.setOptions({
      headerShown: true,
    });
  };
  const renderItem = ({item}: {item: any}) => {
    return (
      <PressableButton
        onPress={() => _onItemSelect(item)}
        style={styles.itemContainer}>
        <Text style={styles.text}>{item.cc}</Text>
        <Text style={styles.symbol}>{item.symbol}</Text>
      </PressableButton>
    );
  };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          transform: [
            {
              translateY: animate.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
        styles.container,
      ]}>
      <View style={styles.header}>
        <View style={styles.crossButtonContainer}>
          <PressableButton onPress={_closeModal}>
            <View>
              <Icons.Entypo name="cross" size={25} color="#000" />
            </View>
          </PressableButton>
        </View>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => item.cc}
        data={props.data}
        renderItem={renderItem}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  crossButtonContainer: {
    padding: 6,
    borderRadius: 100,
    backgroundColor: '#EEE',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  headerText: {
    ...GlobalStyle.TextStyle.header,
    fontFamily: GlobalStyle.Font.Bold,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 60,
    elevation: 2,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
});
