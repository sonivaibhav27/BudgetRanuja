// import {writeFile, DocumentDirectoryPath} from 'react-native-fs';
import {DayJs} from '.';

// const Path = DocumentDirectoryPath + '/budjet/';
type CSVData = {
  Date: Date;
  amount: number;
};

export default async (data: CSVData[]) => {
  const headers = 'Date,Amount';
  const body = data.map(bill => `${bill.Date},${bill.amount}`).join('');
  const csv = `${headers}\n${body}`;
  const fileName = DayJs.todayDate().format('YYYY-MM-DD');

  // await writeFile(Path + fileName, csv, 'utf-8');
  //Nove save to the mobile.
};
