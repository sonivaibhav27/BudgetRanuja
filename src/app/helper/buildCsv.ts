import {writeFile, DownloadDirectoryPath} from 'react-native-fs';
import {BillTypes} from '../../types';
import Utils from '../utils';
import DateHelper from './date';

const getFilePath = (fileName: string) => {
  return (
    DownloadDirectoryPath +
    `/Budjet-${fileName} ${DateHelper.getTodayDateAndTime()}${(
      Math.random() * 1000
    ).toFixed(0)}.csv`
  );
};
export default async (
  data: BillTypes.TCSVBill[],
  fileNameByCategory?: boolean,
) => {
  const fileName = fileNameByCategory
    ? data[0].categoryName
    : DateHelper.todayDate().format('DD-MM-YYYY');
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
          },${bill.billType},"${bill.categoryName}",${bill.billAmount},${
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
  writeFile(getFilePath(fileName), csv)
    .then(() => {
      Utils.makeAlert(
        'Success',
        'CSV saved succesfully.File is saved to downloads folder.',
        () => {},
        false,
      );
    })
    .catch(err => {
      console.log(err);
      Utils.makeToast(err?.message, 'SHORT');
    });
};
