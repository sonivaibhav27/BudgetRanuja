import React from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  FlatList,
  Easing,
  Dimensions,
  BackHandler,
} from 'react-native';
import {CategoryType} from '../database/Types';
import PressableButton from './PressableButton';

const height = Dimensions.get('window').height;

type Props = {
  data: CategoryType[];
  onItemSelect: (item: CategoryType) => void;
  closeModal: () => void;
};

export default ({data, onItemSelect, closeModal}: Props) => {
  console.log({data});
  const animRef = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeModal();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [animRef, closeModal]);

  const _onItemSelect = (item: CategoryType) => {
    Animated.timing(animRef, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      onItemSelect(item);
      closeModal();
    });
  };
  const renderItem = ({item}: {item: CategoryType}) => {
    return (
      <View>
        <PressableButton
          onPress={() => _onItemSelect(item)}
          style={styles.itemContainer}>
          <Text style={styles.text}>{item.CategoryName}</Text>
          {item.CategoryColorCode !== '' ? (
            <View
              style={[
                styles.colorDot,
                {backgroundColor: item.CategoryColorCode},
              ]}
            />
          ) : (
            <View />
          )}
        </PressableButton>
      </View>
    );
  };

  const animatedStyle = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animRef.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
      ]}>
      <Animated.View
        style={[
          styles.innerContainer,
          {transform: [{translateY: animatedStyle}]},
        ]}>
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item, index) => `${item}-${index}`}
          data={data}
          renderItem={renderItem}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  innerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  text: {
    color: '#000',
    fontWeight: '500',
    fontSize: 18,
  },
  colorDot: {
    width: 13,
    height: 13,
    borderRadius: 10,
  },
});