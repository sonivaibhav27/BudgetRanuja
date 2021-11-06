import {Q} from '@nozbe/watermelondb';
import {WatermenlonDB} from '../../..';
import {DatabaseConfig} from '../../config';
import {Logger} from '../../utils';
import {BudgetTypes} from '../Types';

class BudgetOperations {
  static async getCurrentMonthBudget(monthAndYear: number) {
    const getBudget: BudgetTypes[] = await WatermenlonDB.get(
      DatabaseConfig.tables.Budget,
    )
      .query(Q.where('DateAsMonthAndYear', monthAndYear))
      .fetch();
    if (getBudget.length === 0) {
      return null;
    }
    return getBudget[0].BudgetAmount;
  }

  static async upsertBudget(budgetAmount: number, monthAndYear: number) {
    try {
      WatermenlonDB.write(async () => {
        await WatermenlonDB.get(DatabaseConfig.tables.Budget).create(
          (budget: BudgetTypes) => {
            budget.BudgetAmount = budgetAmount;
            budget.DateAsMonthAndYear = monthAndYear;
          },
        );
      });

      Logger.consoleLog('Set successfully.', 'warn');
    } catch (err) {
      Logger.consoleLog(err, 'error');
    }
    // }
  }
}

export default BudgetOperations;
