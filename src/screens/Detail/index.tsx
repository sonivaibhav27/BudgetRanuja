import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  I18nManager,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {Card, AuditSection, ActionButtons} from './components';
import {Icons} from '../../utils';

type Props = {
  navigation: StackNavigationProp<MainStackScreenType, 'Detail'>;
};

interface Data {
  category: string;
  amount: number;
  date: Date;
}

const Data: Data[] = [
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
  },
];

export default (props: Props) => {
  const {height} = useWindowDimensions();
  React.useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.saveToDriveContainer}>
            <Icons.Entypo name="google-drive" color="#000" size={25} />
            <Text style={styles.saveToDriveText}>Save to drive</Text>
          </View>
        );
      },
    });
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <ActionButtons />
      </View>
      <View style={styles.dataContainer}>
        {Data.map((data, index) => {
          return <Card key={index} {...data} />;
        })}
      </View>
      <View style={{height: height * 0.15}}>
        <AuditSection />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  dataContainer: {flex: 1},
  saveToDriveContainer: {
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(89,93,229,0.1)',
    padding: 8,
    borderRadius: 100,
  },
  saveToDriveText: {
    color: '#000',
    paddingLeft: I18nManager.isRTL ? 0 : 4,
    paddingRight: I18nManager.isRTL ? 4 : 0,
  },
});
