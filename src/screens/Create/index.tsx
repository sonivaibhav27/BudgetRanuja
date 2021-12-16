import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {Create, Edit} from './component';

type Props = {
  route: RouteProp<MainStackScreenType, 'Create'>;
};
const CreateEditScreen = ({route}: Props) => {
  if (route.params.screenType === 'Create') {
    return <Create route={route} />;
  } else {
    return <Edit route={route} />;
  }
};

export default CreateEditScreen;
