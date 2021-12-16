import React from 'react';
import {Pressable, View, Text, FlatList, StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../theme&styles';
import {ExtraDetailTypes} from '../../../types';
import {Icons} from '../../../utils';

const formatDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
const RenderFlatlistWithData = ({
  data,
  navigation,
  currency,
}: ExtraDetailTypes.RenderFlatlistWithDataProps) => {
  const goToEditScreen = (itemData: ExtraDetailTypes.DataProp) => {
    const dateInISO = itemData.billDate.toISOString();
    navigation.navigate('Create', {
      comingFrom: itemData.typeOfBill,
      screenType: 'Edit',
      categoryData: {...itemData, billDate: dateInISO},
    });
  };

  const renderItem = ({item}: ExtraDetailTypes.FlatlistItemProp) => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.flex}>
          <View style={styles.rowContainer}>
            <View style={styles.dateAndNumberContainer}>
              <Text style={[styles.commonTextStyle, styles.dateTextStyle]}>
                {formatDate(item.billDate)}
              </Text>
            </View>
            <View style={styles.flexDirection}>
              <Text style={[styles.commonTextStyle, styles.amountTextStyle]}>
                {currency}
                {item.billAmount}
              </Text>
            </View>
          </View>
          {item.billRemark.length !== 0 && (
            <View>
              <Text numberOfLines={2} style={styles.remark}>
                REMARK : {item.billRemark}
              </Text>
            </View>
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
      data={data}
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
    fontFamily: GlobalStyle.Font.SemiBold,
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
    fontFamily: GlobalStyle.Font.Bold,
  },
  flexDirection: {
    flexDirection: 'row',
    alignItems: 'center',
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
