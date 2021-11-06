import {Q} from '@nozbe/watermelondb';
import {ModelTypes} from '../index';
import {DatabaseConfig} from '../../config';
import {Logger} from '../../utils';
import {WatermenlonDB} from '../../..';
import {ExpenseCategories} from '../../data';

export const createBill = async (
  billCategory: string,
  amount: number,
  date: Date,
  typeOfBill: string,
  remark?: string,
): Promise<ModelTypes.BillTypes | undefined> => {
  const billType = typeOfBill === 'income' ? 1 : 2;
  let record;
  await WatermenlonDB.write(async () => {
    record = await WatermenlonDB.collections
      .get(DatabaseConfig.tables.BudgetBills)
      .create((budgetBills: ModelTypes.BillTypes) => {
        budgetBills.billAmount = amount;
        budgetBills.billCategory = billCategory;
        budgetBills.billDate = 21492;
        budgetBills.billType = billType;
        budgetBills.billRemark = remark;
      });
  });
  return record;
};

export const getCurrentMonthBills = async () => {
  Logger.consoleLog('Started', 'log');
  try {
    let bills: ModelTypes.BillTypes[] | undefined;
    bills = await WatermenlonDB.collections
      .get(DatabaseConfig.tables.BudgetBills)
      .query()
      .fetch();

    const sanitizeOutputBills = bills.map(bill => {
      return {
        billAmount: bill.billAmount,
        billCategory: bill.billCategory,
        billType: bill.billType,
        billDate: bill.billDate,
        fill: ExpenseCategories[0][bill.billCategory!],
      };
    });

    return sanitizeOutputBills;
  } catch (err) {
    Logger.consoleLog(`Error in Getting Bills. ${err}`, 'error');
    return null;
  }
};

export const getBillsByCategories = async (category: string) => {
  try {
    let bills: ModelTypes.BillTypes[] | undefined;
    bills = await WatermenlonDB.collections
      .get(DatabaseConfig.tables.BudgetBills)
      .query(Q.where('Category', Q.eq(category)))
      .fetch();
    const sanitize = bills.map(bill => {
      return {
        billCategory: bill.billCategory,
        billAmount: bill.billAmount,
        billDate: bill.billDate,
      };
    });
    Logger.consoleLog(sanitize, 'log');
  } catch (err) {
    Logger.consoleLog('Error in getting individual Category ' + err, 'error');
  }
};

export const resetDatabase = async () => {
  await WatermenlonDB.write(async () => {
    await WatermenlonDB.unsafeResetDatabase();
  });
};

// class BillOperations {
//   public static instance: BillOperations;

//   async createBill(
//     database: Database | null,
//     billCategory: string,
//     amount: number,
//     date: Date,
//     typeOfBill: string,
//     remark?: string,
//   ): Promise<ModelTypes.BillTypes | null | undefined> {
//     try {
//       console.log(database);
//       if (database) {
//         const budgetBillCollection = database.collections.get(
//           DatabaseConfig.tables.BudgetBills,
//         );
//         const billType = typeOfBill === 'income' ? 1 : 2;
//         let record;
//         await database.write(async () => {
//           record = await budgetBillCollection.create(
//             (budgetBills: ModelTypes.BillTypes) => {
//               budgetBills.billAmount = amount;
//               budgetBills.billCategory = billCategory;
//               budgetBills.billDate = 21492;
//               budgetBills.billType = billType;
//             },
//           );
//           //deleting instance
//         });
//         database = null;
//         return record;
//       }
//       // return r;
//     } catch (err) {
//       Logger.consoleLog(err, 'warn');
//       Logger.consoleLog('Error while creating record ' + err, 'error');
//       return null;
//     }
//   }
//   async getCurrentMonthBills(
//     database: Database,
//   ): Promise<ModelTypes.BillTypes[] | null> {
//     try {
//       const data: ModelTypes.BillTypes[] = await database
//         .get(DatabaseConfig.tables.BudgetBills)
//         .query()
//         .fetch();
//       return data;
//     } catch (err) {
//       Logger.consoleLog(`Error in Getting Bills. ${err}`, 'error');
//       return null;
//     }
//   }
//   static async updateBill(bill: any) {
//     bill.update((record: any) => {
//       record;
//     });
//   }
//   static async deleteBill(bill: ModelTypes.BillTypes) {
//     await bill.destroyPermanently();
//   }
// }

// BillOperations.instance = new BillOperations();

// export default BillOperations;
