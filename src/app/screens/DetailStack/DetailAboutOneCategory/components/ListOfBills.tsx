import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Pressable, View, Text, FlatList, StyleSheet} from 'react-native';
import {BillTypes, NavigationTypes} from '../../../../../types';
import {ViewText} from '../../../../components';
import {Icons} from '../../../../helper';
import Utils from '../../../../utils';

const formatDate = (date: Date) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

type RenderFlatlistWithDataProps = {
  data: BillTypes.TBillDatabaseModel[];
  navigation: StackNavigationProp<
    NavigationTypes.TDetailStackScreen & NavigationTypes.TRootStackScreens,
    'DetailAboutOneCategory'
  >;
  currency: string;
};
const RenderFlatlistWithData = ({
  data,
  navigation,
  currency,
}: RenderFlatlistWithDataProps) => {
  const goToEditScreen = (itemData: Required<BillTypes.TBillDatabaseModel>) => {
    console.log({itemData});
    const dateInISO = itemData.billDate.toISOString();
    navigation.navigate('CreateEditScreen', {
      typeOfScreen: 'Edit',
      billData: {
        id: itemData.id,
        billAmount: itemData.billAmount,
        billDate: dateInISO,
        billRemark: itemData.billRemark,
        billType: itemData.billType === 1 ? 'income' : 'expense',
        categoryId: itemData.categoryId,
      },
    });
  };

  const renderItem = ({
    item,
  }: {
    item: Required<BillTypes.TBillDatabaseModel>;
  }) => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.flex}>
          <View style={styles.rowContainer}>
            <ViewText
              viewStyle={styles.dateAndNumberContainer}
              text={formatDate(item.billDate)}
              textStyle={[styles.commonTextStyle, styles.dateTextStyle]}
            />
            <ViewText
              text={`${currency}${Utils.formatIntoCurrency(item.billAmount)}`}
              textStyle={[styles.commonTextStyle, styles.amountTextStyle]}
            />
          </View>
          {item.billRemark.length !== 0 && (
            <ViewText
              text={`REMARK : ${item.billRemark}`}
              textStyle={styles.remark}
            />
          )}
        </View>
        <View style={styles.editContainer}>
          <Pressable
            onPress={() => goToEditScreen(item)}
            hitSlop={{top: 5, left: 5, right: 5}}>
            <Icons.AntDesign size={17} name="edit" color="#000" />
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <FlatList
      keyExtractor={(item, index) => item.billAmount + index.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={styles.flex}
      ListHeaderComponent={
        <View style={[styles.rowContainer, styles.headerRowContainer]}>
          <Text style={styles.commonHeaderTextStyle}>Date</Text>
          <Text style={styles.commonHeaderTextStyle}>Amount</Text>
        </View>
      }
      data={data as Required<BillTypes.TBillDatabaseModel>[]}
      stickyHeaderIndices={[0]}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {borderBottomWidth: 1, borderBottomColor: '#EEE'},
  dateAndNumberContainer: {
    flexDirection: 'row',
  },
  commonTextStyle: {
    color: '#000',
    fontSize: 18,
  },
  amountTextStyle: {
    marginRight: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  dateTextStyle: {
    fontSize: 14,
  },
  commonHeaderTextStyle: {
    color: '#000',
    fontSize: 16,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  remark: {
    fontSize: 13,
    color: '#444',
    paddingRight: 8,
  },
  editContainer: {
    padding: 8,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex: 1,
  },
  headerRowContainer: {
    elevation: 2,
    backgroundColor: '#fff',
    padding: 15,
  },
});

export default RenderFlatlistWithData;
