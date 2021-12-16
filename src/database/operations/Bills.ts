import {Q} from '@nozbe/watermelondb';
import {DatabaseConfig} from '../../config';
import {DayJs, Logger, Toast} from '../../utils';
import {WatermenlonDB} from '../../..';
import {
  BillModelType,
  OnlyInformationFromBillType,
  TCSVBills,
} from '../../types';
import {CategoryOperations} from '.';

export const createBill = async (
  categoryId: string,
  amount: string,
  date: Date,
  typeOfBill: string,
  isRepeatDaily?: boolean,
  remark?: string,
): Promise<BillModelType | undefined> => {
  if (
    categoryId.length === 0 ||
    typeOfBill.length === 0 ||
    date === undefined ||
    amount === ''
  ) {
    Toast('Data missing , please fill all mandatory field', 'LONG');
    return;
  }
  try {
    const billType = typeOfBill === 'income' ? 1 : 2;
    let record;
    if (isRepeatDaily) {
      let bills: BillModelType[] = [];
      const lastDateOfMonth = DayJs.getLastDayOfMonth();
      for (let day = date.getDate(); day <= lastDateOfMonth; day++) {
        bills.push(
          WatermenlonDB.collections
            .get(DatabaseConfig.tables.BudgetBills)
            .prepareCreate((model: BillModelType) => {
              model.billAmount = +amount;
              model.categoryId = categoryId;
              model.billType = billType;
              model.billRemark = remark;
              model.billMonthAndYear = DayJs.getCurrentYearAndMonth();
              model.billDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                day,
              );
            }),
        );
      }
      await WatermenlonDB.write(async () => {
        await WatermenlonDB.batch(...bills);
      });
    } else {
      await WatermenlonDB.write(async () => {
        record = await WatermenlonDB.collections
          .get(DatabaseConfig.tables.BudgetBills)
          .create((budgetBills: BillModelType) => {
            budgetBills.billAmount = +amount;
            budgetBills.categoryId = categoryId;
            budgetBills.billDate = date;
            budgetBills.billType = billType;
            budgetBills.billRemark = remark;
            budgetBills.billMonthAndYear = DayJs.getCurrentYearAndMonth();
          });
      });
    }
    return record;
  } catch (err) {
    Logger.consoleLog(JSON.stringify(err), 'error');
    // Logger.trackLog(JSON.stringify(err));
    Toast('Something went wrong.');
  }
};

export const updateBill = async (
  id: string,
  amount: string,
  date: Date,
  typeOfBill: 'expense' | 'income',
  remark: string,
  categoryId: string,
) => {
  try {
    const findModel = await WatermenlonDB.get(
      DatabaseConfig.tables.BudgetBills,
    ).find(id);
    if (findModel) {
      await WatermenlonDB.write(async () => {
        await findModel.update((model: BillModelType) => {
          model.billAmount = +amount!;
          model.billDate = date;
          model.billType = typeOfBill === 'income' ? 1 : 2;
          model.billRemark = remark;
          model.categoryId = categoryId;
        });
      });
      Toast('Successfully updated the bill');
      return;
    }
    throw new Error('Id not found in database.');
  } catch (error) {
    Toast('Error while updating the bill ' + error.message);
  }
};

export const deleteBill = async (id: string) => {
  try {
    const findModel = await WatermenlonDB.get(
      DatabaseConfig.tables.BudgetBills,
    ).find(id);
    if (findModel) {
      await WatermenlonDB.write(async () => {
        await findModel.destroyPermanently();
      });
      Toast('Successfully deleted the bill');
      return true;
    }
    throw new Error('Id not found in database.');
  } catch (error) {
    Toast('Error while deleting the bill ' + error.message);
    return false;
  }
};

export const getCurrentMonthBills = async (forYearAndMonth: number) => {
  Logger.consoleLog('Started', 'log');
  try {
    let bills: BillModelType[] | undefined;
    bills = await WatermenlonDB.collections
      .get(DatabaseConfig.tables.BudgetBills)
      .query(Q.where('DateAsYearAndMonth', Q.eq(forYearAndMonth)))
      .fetch();

    const sanitizeOutputBills: OnlyInformationFromBillType[] = bills?.map(
      bill => {
        return {
          billAmount: bill.billAmount!,
          typeOfBill: bill.billType! === 1 ? 'income' : 'expense',
          categoryId: bill.categoryId!,
        };
      },
    );
    return sanitizeOutputBills;
  } catch (err) {
    Logger.consoleLog(`Error in Getting Bills. ${err}`, 'error');
    return null;
  }
};

export const getBillsByCategoriesAndMonth = async (
  categoryId: string,
  monthAndYear: number,
) => {
  try {
    let bills: BillModelType[] | undefined;
    bills = await WatermenlonDB.collections
      .get(DatabaseConfig.tables.BudgetBills)
      .query(
        Q.and(
          Q.where('Category_Id', Q.eq(categoryId)),
          Q.where('DateAsYearAndMonth', monthAndYear),
        ),
      )
      .fetch();
    const sanitize = bills.map(bill => {
      return {
        billAmount: bill.billAmount!,
        billDate: bill.billDate!,
        billRemark: bill.billRemark!,
        categoryId: bill.categoryId!,
        typeOfBill: bill.billType! === 1 ? 'income' : 'expense',
        id: bill.id,
      };
    });
    return sanitize;
  } catch (err) {
    Logger.consoleLog('Error in getting individual Category ' + err, 'error');
    return [];
  }
};

export const getBillsByDateInDetailForCSV = async (
  dateAsYearAndMonth: number,
) => {
  try {
    let bills: BillModelType[] | undefined;
    bills = await WatermenlonDB.collections
      .get(DatabaseConfig.tables.BudgetBills)
      .query(Q.where('DateAsYearAndMonth', Q.eq(dateAsYearAndMonth)))
      .fetch();
    const sanitize: TCSVBills[] = bills.map(bill => {
      return {
        billAmount: bill.billAmount!,
        billDate: bill.billDate!,
        billRemark: bill.billRemark!,
        billType: bill.billType! === 1 ? 'income' : 'expense',
        categoryName:
          CategoryOperations._rawDictionary[bill.categoryId!][0] ||
          'Not Defined ',
      };
    });
    return sanitize;
  } catch (err) {
    Toast('Error while getting record from database.');
  }
};
