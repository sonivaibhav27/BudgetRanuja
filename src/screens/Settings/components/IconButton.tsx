import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Icons} from '../../../utils';
import {PressableButton} from '../../../common';

type Props = {
  text: string;
  iconName:
    | 'text-document'
    | 'share'
    | 'dollar'
    | 'circle-with-plus'
    | 'mail'
    | 'delete'
    | 'lock'
    | 'clipboard-notes';
  showChevronRightIcon?: boolean;
  iconFamily: 'Entypo' | 'Fontisto' | 'AntDesign' | 'Foundation';
  onPress: () => void;
};

const getIconFamily = (iconFamily: Props['iconFamily']) => {
  return Icons[iconFamily];
};

const IconButton = (props: Props) => {
  const Icon = getIconFamily(props.iconFamily);
  return (
    <PressableButton onPress={props.onPress} style={styles.container}>
      <>
        <View style={styles.iconAndTextContainer}>
          <Icon name={props.iconName} size={25} color="#000" />
          <Text style={styles.textStyle}>{props.text}</Text>
        </View>
        {props.showChevronRightIcon && (
          <Icons.Entypo name={'chevron-right'} size={25} color="#000" />
        )}
      </>
    </PressableButton>
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
    fontSize: 16,
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
});

export default IconButton;
