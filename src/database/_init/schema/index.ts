import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {DatabaseConfig} from '../../../config';

export default appSchema({
  version: DatabaseConfig.dbVersion,
  tables: [
    // We'll add tableSchemas here later
    tableSchema({
      name: DatabaseConfig.tables.BudgetBills,
      columns: [
        {
          name: 'Amount',
          type: 'number',
        },
        {
          name: 'Date',
          type: 'number',
        },
        {
          name: 'Remark',
          type: 'string',
          isOptional: true,
        },
        {
          name: 'Type',
          type: 'number',
        },
        {
          name: 'Category',
          type: 'string',
        },
      ],
    }),
    tableSchema({
      name: DatabaseConfig.tables.Budget,
      columns: [
        {
          name: 'DateAsMonthAndYear',
          type: 'number',
        },
        {
          name: 'BudgetAmount',
          type: 'number',
        },
      ],
    }),
  ],
});
