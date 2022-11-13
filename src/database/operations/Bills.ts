import {Q} from '@nozbe/watermelondb';
import {WatermenlonDB} from '../../..';
import {BillTypes, UtilTypes} from '../../types';
import {CategoryOperations} from '.';
import Utils from '../../app/utils';
import {DateHelper} from '../../app/helper';
import {TABLES} from '../db.config';

export const createBill = async (
  categoryId: string,
  amount: string,
  date: Date,
  typeOfBill: string,
  isRepeatDaily?: boolean,
  remark?: string,
): Promise<BillTypes.TBillDatabaseModel | undefined> => {
  if (
    categoryId.length === 0 ||
    typeOfBill.length === 0 ||
    date === undefined ||
    amount === ''
  ) {
    Utils.makeToast('Data missing , please fill all mandatory field', 'LONG');
    return;
  }
  try {
    const billType = typeOfBill === 'income' ? 1 : 2;
    let record;
    if (isRepeatDaily) {
      let bills: BillTypes.TBillDatabaseModel[] = [];
      const lastDateOfMonth = DateHelper.getLastDayOfMonth();
      for (let day = date.getDate(); day <= lastDateOfMonth; day++) {
        bills.push(
          WatermenlonDB.collections
            .get(TABLES.BudgetBills)
            .prepareCreate((model: BillTypes.TBillDatabaseModel) => {
              model.billAmount = +amount;
              model.categoryId = categoryId;
              model.billType = billType;
              model.billRemark = remark;
              model.billMonthAndYear = DateHelper.getCurrentYearAndMonth();
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
          .get(TABLES.BudgetBills)
          .create((budgetBills: BillTypes.TBillDatabaseModel) => {
            budgetBills.billAmount = +amount;
            budgetBills.categoryId = categoryId;
            budgetBills.billDate = date;
            budgetBills.billType = billType;
            budgetBills.billRemark = remark;
            budgetBills.billMonthAndYear = DateHelper.getCurrentYearAndMonth();
          });
      });
    }
    return record;
  } catch (err) {
    // Logger.trackLog(JSON.stringify(err));
    Utils.makeToast('Something went wrong.');
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
    const findModel = await WatermenlonDB.get(TABLES.BudgetBills).find(id);
    if (findModel) {
      await WatermenlonDB.write(async () => {
        await findModel.update((model: BillTypes.TBillDatabaseModel) => {
          model.billAmount = +amount!;
          model.billDate = date;
          model.billType = typeOfBill === 'income' ? 1 : 2;
          model.billRemark = remark;
          model.categoryId = categoryId;
        });
      });
      Utils.makeToast('Successfully updated the bill');
      return;
    }
    throw new Error('Id not found in database.');
  } catch (error: any) {
    Utils.makeToast('Error while updating the bill ' + error.message);
  }
};

export const deleteBill = async (id: string) => {
  try {
    const findModel = await WatermenlonDB.get(TABLES.BudgetBills).find(id);
    if (findModel) {
      await WatermenlonDB.write(async () => {
        await findModel.destroyPermanently();
      });
      Utils.makeToast('Successfully deleted the bill');
      return true;
    }
    throw new Error('Id not found in database.');
  } catch (error: any) {
    Utils.makeToast('Error while deleting the bill ' + error.message);
    return false;
  }
};

export const getCurrentMonthBills = async (forYearAndMonth: number) => {
  try {
    let bills: BillTypes.TBillDatabaseModel[] | undefined;
    bills = await WatermenlonDB.collections
      .get(TABLES.BudgetBills)
      .query(Q.where('DateAsYearAndMonth', Q.eq(forYearAndMonth)))
      .fetch();

    const sanitizeOutputBills: UtilTypes.TOnlyInformationFromBill[] =
      bills?.map(bill => {
        return {
          billAmount: bill.billAmount!,
          typeOfBill: bill.billType! === 1 ? 'income' : 'expense',
          categoryId: bill.categoryId!,
        };
      });
    return sanitizeOutputBills;
  } catch (err) {
    return null;
  }
};

export const getBillsByCategoriesAndMonth = async (
  categoryId: string,
  monthAndYear: number,
) => {
  try {
    let bills: BillTypes.TBillDatabaseModel[] | undefined;
    bills = await WatermenlonDB.collections
      .get(TABLES.BudgetBills)
      .query(
        Q.and(
          Q.where('Category_Id', Q.eq(categoryId)),
          Q.where('DateAsYearAndMonth', monthAndYear),
        ),
        Q.sortBy('Date_at'),
      )
      .fetch();
    const sanitize = bills.map(bill => {
      return {
        billAmount: bill.billAmount!,
        billDate: bill.billDate!,
        billRemark: bill.billRemark!,
        categoryId: bill.categoryId!,
        id: bill.id,
        billType: bill.billType,
      };
    });
    return sanitize;
  } catch (err) {
    return [];
  }
};

export const generateReportData = async (date: Date, categoryId?: string) => {
  try {
    const yearAndMonth = DateHelper.getYearAndMonthFromDate(date);
    let condition = categoryId
      ? Q.and(
          Q.where('DateAsYearAndMonth', Q.eq(yearAndMonth)),
          Q.where('Category_Id', Q.eq(categoryId!)),
        )
      : Q.where('DateAsYearAndMonth', Q.eq(yearAndMonth));
    let bills: BillTypes.TBillDatabaseModel[] | undefined;
    bills = await WatermenlonDB.collections
      .get(TABLES.BudgetBills)
      .query(condition, Q.sortBy('Date_at', Q.asc))
      .fetch();
    const sanitize: BillTypes.TCSVBill[] = bills.map(bill => {
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
    Utils.makeToast('Error while getting record from database.');
  }
};

export const getBillsByDateInDetailForCSV = async (
  dateAsYearAndMonth: number,
) => {
  try {
    let bills: BillTypes.TBillDatabaseModel[] | undefined;
    bills = await WatermenlonDB.collections
      .get(TABLES.BudgetBills)
      .query(
        Q.where('DateAsYearAndMonth', Q.eq(dateAsYearAndMonth)),
        Q.sortBy('Date_at', Q.asc),
      )
      .fetch();
    const sanitize: BillTypes.TCSVBill[] = bills.map(bill => {
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
    Utils.makeToast('Error while getting record from database.');
  }
};

export const getNLatestRecord = async (
  noOfRecords: number,
  currentYearMonth: number,
) => {
  let bills: BillTypes.TBillDatabaseModel[] | undefined;
  bills = await WatermenlonDB.collections
    .get(TABLES.BudgetBills)
    .query(
      Q.where('DateAsYearAndMonth', currentYearMonth),
      Q.take(noOfRecords),
      Q.sortBy('Date_at', Q.desc),
    )
    .fetch();
  const sanitize: BillTypes.TBill[] = bills.map(bill => {
    return {
      billAmount: bill.billAmount!,
      billDate: bill.billDate!,
      billRemark: bill.billRemark!,
      categoryId: bill.categoryId!,
      billType: bill.billType! === 1 ? 'income' : 'expense',
    };
  });
  return sanitize;
};
