import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Icons} from '../../helper';
import {Pressable, Text} from '../atoms';

type Props = {
  text?: string;
  iconName: string;
  iconFamily: 'Entypo' | 'Fontisto' | 'AntDesign' | 'Foundation';
  onPress: () => void;
  headerRight?: JSX.Element;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const getIconFamily = (iconFamily: Props['iconFamily']) => {
  return Icons[iconFamily];
};

const IconButton = (props: Props) => {
  const Icon = getIconFamily(props.iconFamily);
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.container, props.style as any]}>
      <>
        <View
          style={
            typeof props.text !== 'undefined' && styles.iconAndTextContainer
          }>
          <Icon
            style={styles.iconStyle}
            name={props.iconName}
            size={25}
            color="#333"
          />
          {typeof props.text !== 'undefined' && (
            <Text
              textType="normal"
              style={[
                styles.textStyle,
                typeof props.textStyle !== 'undefined' ? props.textStyle : {},
              ]}>
              {props.text}
            </Text>
          )}
        </View>
        {typeof props.headerRight !== 'undefined' ? props.headerRight : null}
      </>
    </Pressable>
  );
};

IconButton.defaultProps = {
  iconFamily: 'Entypo',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: '#eee',
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  textStyle: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.9,
  },
  iconStyle: {
    width: 25,
    textAlign: 'center',
  },
});

export default IconButton;
