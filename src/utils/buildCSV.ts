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
  return `/${fileName}-budjet.csv`;
};
export default async (data: TCSVBills[], fileNameByCategory?: boolean) => {
  const permission = await checkPermission();
  if (permission) {
    const fileName = fileNameByCategory
      ? data[0].categoryName
      : DayJs.todayDate().format('DD-MM-YYYY');
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
    writeFile(DownloadDirectoryPath + getFileName(fileName), csv)
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
