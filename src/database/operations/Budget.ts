import {Q} from '@nozbe/watermelondb';
import {WatermenlonDB} from '../../..';
import {DatabaseConfig} from '../../config';
import {BudgetModelType} from '../../types';
import {DayJs, Logger, Toast} from '../../utils';

class BudgetOperations {
  static async getCurrentMonthBudget(monthAndYear: number) {
    const getBudget: BudgetModelType[] = await WatermenlonDB.get(
      DatabaseConfig.tables.Budget,
    )
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
    const monthAndYear = DayJs.getCurrentYearAndMonth();
    try {
      const getBudget: BudgetModelType[] = await WatermenlonDB.get(
        DatabaseConfig.tables.Budget,
      )
        .query(Q.where('DateAsYearAndMonth', monthAndYear))
        .fetch();
      if (getBudget.length === 0) {
        await WatermenlonDB.write(async () => {
          await WatermenlonDB.get(DatabaseConfig.tables.Budget).create(
            (budget: BudgetModelType) => {
              budget.BudgetAmount = budgetAmount;
              budget.DateAsYearAndMonth = monthAndYear;
            },
          );
        });
        Toast('Budget set successfully.');
      } else {
        await WatermenlonDB.write(async () => {
          getBudget[0].update(budgetToUpdate => {
            budgetToUpdate.BudgetAmount = budgetAmount;
          });
        });
        Toast('Budget update successfully.');
      }

      // Logger.consoleLog('Set successfully.', 'warn');
    } catch (err) {
      Logger.consoleLog(err, 'error');
    }
    // }
  }
}

export default BudgetOperations;
