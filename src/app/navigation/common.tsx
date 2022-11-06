import React from 'react';
import {Header} from '../components';
import {Icons} from '../helper';

export const HeaderBackImage = ({tintColor}: {tintColor: string}) => {
  return <Icons.Ionicons name="ios-arrow-back" color={tintColor} size={27} />;
};

type HeaderSubScreenTitleProps = {
  title: string;
};
export const HeaderSubScreenTitle = (props: HeaderSubScreenTitleProps) => {
  return (
    <Header
      // eslint-disable-next-line react-native/no-inline-styles
      style={{left: -28, top: 0}}
      textAlign="left"
      headerTitle={props.title}
      textType="subheading"
      textStyle={{fontSize: 20}}
    />
  );
};
