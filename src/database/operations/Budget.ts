import {Q} from '@nozbe/watermelondb';
import {WatermenlonDB} from '../../..';
import {DateHelper} from '../../app/helper';
import Utils from '../../app/utils';
import {BudgetTypes} from '../../types';
import {TABLES} from '../db.config';

class BudgetOperations {
  static async getCurrentMonthBudget(monthAndYear: number) {
    const getBudget: BudgetTypes.TBudgetDatabaseModel[] =
      await WatermenlonDB.get(TABLES.Budget)
        .query(Q.where('DateAsYearAndMonth', monthAndYear))
        .fetch();
    if (getBudget.length === 0) {
      return undefined;
    }
    if (getBudget.length > 1) {
      return getBudget[getBudget.length - 1].BudgetAmount;
    }
    return getBudget[0].BudgetAmount;
  }

  static async upsertBudget(budgetAmount: number) {
    const monthAndYear = DateHelper.getCurrentYearAndMonth();
    try {
      const getBudget: BudgetTypes.TBudgetDatabaseModel[] =
        await WatermenlonDB.get(TABLES.Budget)
          .query(Q.where('DateAsYearAndMonth', monthAndYear))
          .fetch();
      if (getBudget.length === 0) {
        await WatermenlonDB.write(async () => {
          await WatermenlonDB.get(TABLES.Budget).create(
            (budget: BudgetTypes.TBudgetDatabaseModel) => {
              budget.BudgetAmount = budgetAmount;
              budget.DateAsYearAndMonth = monthAndYear;
            },
          );
        });
        Utils.makeToast('Budget set successfully.');
      } else {
        await WatermenlonDB.write(async () => {
          getBudget[0].update(budgetToUpdate => {
            budgetToUpdate.BudgetAmount = budgetAmount;
          });
        });
        Utils.makeToast('Budget update successfully.');
      }

      // Logger.consoleLog('Set successfully.', 'warn');
    } catch (err: any) {
      Utils.makeToast('Error while saving to Database' + err.message || '');
    }
    // }
  }
}

export default BudgetOperations;
