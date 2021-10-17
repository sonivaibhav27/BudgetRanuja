import React from 'react';
import {useWindowDimensions} from 'react-native';
import {VictoryPie} from 'victory-native';

export default () => {
  const {height} = useWindowDimensions();
  return (
    <VictoryPie
      height={height * 0.5}
      labelPlacement="perpendicular"
      labelPosition="startAngle"
    />
  );
};
