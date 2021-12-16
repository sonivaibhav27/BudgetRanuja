import {Q} from '@nozbe/watermelondb';
import {Alert} from 'react-native';
import {DatabaseConfig} from '../../config';
import {DayJs, Miscellaneous, Toast} from '../../utils';
import {WatermenlonDB} from '../../..';
import {BudgetModelType, TCategoryType, BillModelType} from '../../types';
import {BillOperations, CategoryOperations, BudgetOperations} from '.';

type DeleteType =
  | 'last_month'
  | 'last_3_month'
  | 'last_6_month'
  | 'last_year'
  | 'delete_all';

class CommonOperations {
  static columnName = 'DateAsYearAndMonth';
  static getBillsCollection() {
    return WatermenlonDB.get(DatabaseConfig.tables.BudgetBills);
  }

  static getBudgetCollection() {
    return WatermenlonDB.get(DatabaseConfig.tables.Budget);
  }

  static getCategoryCollection() {
    return WatermenlonDB.get(DatabaseConfig.tables.Categories);
  }

  static DeleteBills(deleteType: DeleteType) {
    Alert.alert('Delete', "Deleted data can't be recovered again?", [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: () => this._DeleteBill(deleteType),
      },
    ]);
  }

  static async _DeleteBill(deleteType: DeleteType) {
    switch (deleteType) {
      case 'last_month':
        await this._Delete1Month();
        break;
      case 'last_3_month':
        await this._Delete3Month();
        break;
      case 'last_6_month':
        await this._Delete6Month();
        break;
      case 'last_year':
        await this._Delete1Year();
        break;
      case 'delete_all':
        await this._DeleteAll();
        break;
      default:
        break;
    }
  }

  static async _DeleteAll() {
    try {
      await WatermenlonDB.write(async () => {
        await WatermenlonDB.unsafeResetDatabase();
      });
      Toast('Delete All Bills');
    } catch (err) {
      Toast('Error');
    }
  }
  static async _Delete1Month() {
    const todayDate = DayJs.todayDate().toDate();
    const currentMonth = todayDate.getMonth();
    const currentYear = todayDate.getFullYear();
    const yearAndMonthOfBillToDelete = Number(
      `${currentMonth === 0 ? currentYear - 1 : currentYear}${
        currentMonth === 0 ? 11 : currentMonth - 1
      }`,
    );
    try {
      const bills: BillModelType[] = await this.getBillsCollection()
        .query(Q.where(this.columnName, yearAndMonthOfBillToDelete))
        .fetch();

      const budget: BudgetModelType[] = await this.getBudgetCollection()
        .query(Q.where(this.columnName, yearAndMonthOfBillToDelete))
        .fetch();

      this._DeleteHelper(bills, budget);
    } catch (err) {
      Toast('Error while Deleting bill ' + err.message, 'LONG');
    }
  }

  static async _Delete3Month() {
    const startRange = DayJs.subtractDate(3);
    const endRange = DayJs.subtractDate(1);
    const startMonth = Miscellaneous.MonthAccordingToDatahase(
      startRange.getMonth(),
    );
    const endMonth = Miscellaneous.MonthAccordingToDatahase(
      endRange.getMonth(),
    );

    const betweenRange = [
      Number(`${startRange.getFullYear()}${startMonth}`),
      Number(`${endRange.getFullYear()}${endMonth}`),
    ];
    try {
      const bills: BillModelType[] = await this.getBillsCollection()
        .query(
          Q.where(this.columnName, Q.between(betweenRange[0], betweenRange[1])),
        )
        .fetch();

      const budget: BudgetModelType[] = await this.getBudgetCollection()
        .query(
          Q.where(this.columnName, Q.between(betweenRange[0], betweenRange[1])),
        )
        .fetch();

      this._DeleteHelper(bills, budget);
    } catch (err) {
      Toast('Error while Deleting bill ' + err.message, 'LONG');
    }
  }

  static async _Delete6Month() {
    const startRange = DayJs.subtractDate(6);
    const endRange = DayJs.subtractDate(1);
    const startMonth = startRange.getMonth();
    const startMonthSanitize =
      Miscellaneous.MonthAccordingToDatahase(startMonth);
    const endMonth = endRange.getMonth();
    const endMonthSanitize = Miscellaneous.MonthAccordingToDatahase(endMonth);
    const betweenRange = [
      Number(`${startRange.getFullYear()}${startMonthSanitize}`),
      Number(`${endRange.getFullYear()}${endMonthSanitize}`),
    ];
    try {
      const bills: BillModelType[] = await this.getBillsCollection()
        .query(
          Q.where(this.columnName, Q.between(betweenRange[0], betweenRange[1])),
        )
        .fetch();

      const budget: BudgetModelType[] = await this.getBudgetCollection()
        .query(
          Q.where(this.columnName, Q.between(betweenRange[0], betweenRange[1])),
        )
        .fetch();

      this._DeleteHelper(bills, budget);
    } catch (err) {
      Toast('Error while Deleting bill ' + err.message, 'LONG');
    }
  }

  static async _Delete1Year() {
    const todayDate = DayJs.todayDate().toDate();
    const yearToDelete = todayDate.getFullYear() - 1;
    const betweenRange = [
      Number(`${yearToDelete}00`),
      Number(`${yearToDelete}11`),
    ];
    try {
      const bills: BillModelType[] = await this.getBillsCollection()
        .query(
          Q.where(this.columnName, Q.between(betweenRange[0], betweenRange[1])),
        )
        .fetch();

      const budget: BudgetModelType[] = await this.getBudgetCollection()
        .query(
          Q.where(this.columnName, Q.between(betweenRange[0], betweenRange[1])),
        )
        .fetch();

      this._DeleteHelper(bills, budget);
    } catch (err) {
      Toast('Error while Deleting bill ' + err.message, 'LONG');
    }
  }

  static async _DeleteHelper(
    bills: BillModelType[],
    budget: BudgetModelType[],
  ) {
    let deleteBills = bills.map(bill => {
      return bill.prepareDestroyPermanently();
    });
    let deleteBudget = budget.map(bud => {
      return bud.prepareDestroyPermanently();
    });
    let deleteThings = [...deleteBills, ...deleteBudget];
    await WatermenlonDB.write(async () => {
      await WatermenlonDB.batch(...deleteThings);
    });
    Toast(`Deleted ${bills.length} Bills.`);
  }

  static async GetBillsCategoryBudget(
    dateAsYearAndMonth: number,
    getCategories: boolean,
  ) {
    try {
      const bills = BillOperations.getCurrentMonthBills(dateAsYearAndMonth);
      let categories: Promise<TCategoryType[] | undefined>;
      if (getCategories) {
        categories = CategoryOperations.getAllCategories();
      }
      const budget = BudgetOperations.getCurrentMonthBudget(dateAsYearAndMonth);
      let promise = await Promise.all([bills, budget, categories!]);
      if (getCategories && promise[2]?.length === 0) {
        const isSuccess = await CategoryOperations.UploadAllCategoriesInDB();
        promise[2] = await CategoryOperations.getAllCategories();
        if (!isSuccess) {
          throw new Error('Error');
        }
      }
      console.log({promise});

      if (!getCategories) {
        return {
          DBBills: promise[0]!,
          DBBudget: typeof promise[1] === 'undefined' ? -1 : promise[1],
        };
      }
      return {
        DBBills: promise[0]!,
        DBBudget: typeof promise[1] === 'undefined' ? -1 : promise[1],
        DBCategories: promise[2]!,
      };
    } catch (err) {
      Toast('Error while getting data from database', 'LONG');
    }
  }
}

export default CommonOperations;
