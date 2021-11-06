import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MainStack from './MainStack';
import {Theme} from '../theme&styles';
import Database from '@nozbe/watermelondb/Database';

interface Props {
  database: Database;
}

export default (props: Props) => {
  return (
    <NavigationContainer theme={Theme.Colors_Dark}>
      <MainStack database={props.database} />
    </NavigationContainer>
  );
};
