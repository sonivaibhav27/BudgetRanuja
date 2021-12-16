import {
  addColumns,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';
import {DatabaseConfig} from '../../../config';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: DatabaseConfig.tables.BudgetBills,
          columns: [
            {
              name: 'MonthAndYearOfBill',
              type: 'number',
            },
          ],
        }),
      ],
    },
  ],
});
