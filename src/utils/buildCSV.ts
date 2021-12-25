import {Alert, PermissionsAndroid} from 'react-native';
import {writeFile, DownloadDirectoryPath} from 'react-native-fs';
import {DayJs} from '.';
import {TCSVBills} from '../types';
import Toast from './Toast';
const checkPermission = async () => {
  const permission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  console.log({permission});
  if (!permission) {
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (response === 'granted') {
      return true;
    } else if (response === 'denied') {
      Toast('Need Permission to download file.');
      return false;
    } else {
      return false;
    }
  }
  return true;
};

const getFileName = (fileName: string) => {
  return (
    DownloadDirectoryPath +
    `/${fileName}-${new Date().getUTCMilliseconds()}${(
      Math.random() * 1000
    ).toFixed(0)}-budjet.csv`
  );
};
export default async (data: TCSVBills[], fileNameByCategory?: boolean) => {
  const permission = await checkPermission();
  if (permission) {
    const fileName = fileNameByCategory
      ? data[0].categoryName
      : DayJs.todayDate().format('DD-MM-YYYY');
    let headers, body;
    if (!fileNameByCategory) {
      headers = 'Date,Bill Type,Bill Category,Amount,Remark';
      body = data
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
    } else {
      headers = 'Date,Amount,Remark';
      body = data
        .map(
          bill =>
            `${
              bill.billDate!.getDate().toString() +
              '/' +
              (bill.billDate!.getMonth() + 1).toString() +
              '/' +
              bill.billDate!.getFullYear()
            },${bill.billAmount},${bill.billRemark}\n`,
        )
        .join('');
    }
    const csv = `${headers}\n${body}`;
    writeFile(getFileName(fileName), csv)
      .then(() => {
        Alert.alert(
          'Success',
          'CSV saved succesfully.File is saved to downloads folder.',
        );
      })
      .catch(err => {
        console.log(err);
        Toast(err?.message, 'SHORT');
      });
  }
  // await writeFile(Path + fileName, csv, 'utf-8');
  //Nove save to the mobile.
};
