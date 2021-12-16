// import {writeFile, DocumentDirectoryPath} from 'react-native-fs';
// import {DayJs} from '.';

import {Alert} from 'react-native';
import {writeFile, DownloadDirectoryPath} from 'react-native-fs';
import {TCSVBills} from '../types';
// const Path = DocumentDirectoryPath + '/budjet/';

export default async (data: TCSVBills[]) => {
  const headers = 'Date,Bill Type,Bill Category,Amount,Remark';
  const body = data
    .map(
      bill =>
        `${
          bill.billDate!.getDate().toString() +
          '/' +
          (bill.billDate!.getMonth() + 1).toString() +
          '/' +
          bill.billDate!.getFullYear()
        },${bill.billType},${bill.categoryName},${bill.billAmount},${
          bill.billRemark
        }\n`,
    )
    .join('');
  const csv = `${headers}\n${body}`;
  writeFile(DownloadDirectoryPath + '/ranuja.csv', csv)
    .then(() => {
      Alert.alert('Success', 'Data saved succesfully');
    })
    .catch(err => {
      console.log(err);
    });

  // await writeFile(Path + fileName, csv, 'utf-8');
  //Nove save to the mobile.
};
