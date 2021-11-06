import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilCallback} from 'recoil';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {DataAtom} from '../../State/Atoms/Detail';
import {GlobalStyle} from '../../theme&styles';
import {TotalSection} from './components';

type Props = StackScreenProps<MainStackScreenType, 'DetailAboutOneCategory'>;

type FlatlistItemProp = {
  item: {date: Date; amount: string};
  index: number;
};
type DataProp = {date: Date; amount: string}[];

type RenderFlatlistWithDataProps = {
  data: DataProp;
};

const RenderFlatlistWithData = ({data}: RenderFlatlistWithDataProps) => {
  React.useEffect(() => {
    const data = GetDataFromRecoil();
    console.log({data});
  }, []);

  const GetDataFromRecoil = useRecoilCallback(({snapshot}) => () => {
    return snapshot.getLoadable(DataAtom).contents;
  });

  const renderItem = ({item, index}: FlatlistItemProp) => {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.dateAndNumberContainer}>
          <Text style={[styles.commonTextStyle, styles.numberTextStyle]}>
            {index + 1}.
          </Text>
          <Text style={[styles.commonTextStyle, styles.dateTextStyle]}>
            16/07/{item.date.getFullYear()}
          </Text>
        </View>
        <Text style={[styles.commonTextStyle, styles.amountTextStyle]}>
          ${item.amount}
        </Text>
      </View>
    );
  };
  return (
    <FlatList
      style={styles.flex}
      ListHeaderComponent={
        <View style={[styles.rowContainer, styles.headerRowContainer]}>
          <Text style={styles.commonHeaderTextStyle}>Date</Text>
          <Text style={styles.commonHeaderTextStyle}>Amount</Text>
        </View>
      }
      data={data}
      renderItem={renderItem}
    />
  );
};

const Data: DataProp = new Array(1000).fill({
  date: new Date(),
  amount: '200',
});

export default (props: Props) => {
  const onGenerateReportButtonPressed = () => {};
  React.useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={onGenerateReportButtonPressed}
            style={styles.exportToCSVContainer}>
            <Text style={styles.exportToCSVText}> &#x25a6; Export as csv</Text>
          </TouchableOpacity>
        );
      },
    });
  }, []);
  return (
    <View style={styles.flex}>
      <RenderFlatlistWithData data={Data} />
      <TotalSection amount={20000} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    padding: 10,
    marginHorizontal: 20,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    justifyContent: 'space-between',
    // flex: 1,
  },
  dateAndNumberContainer: {
    flexDirection: 'row',
  },
  commonTextStyle: {
    color: '#000',
    fontSize: 18,
    fontFamily: GlobalStyle.Font.SemiBold,
  },
  numberTextStyle: {},
  amountTextStyle: {},
  dateTextStyle: {},
  commonHeaderTextStyle: {
    color: '#000',
    fontSize: 20,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: GlobalStyle.Font.Bold,
  },
  headerRowContainer: {
    borderBottomWidth: 0,
  },
  exportToCSVContainer: {
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 100,
  },
  exportToCSVText: {
    color: '#fff',
  },
});
