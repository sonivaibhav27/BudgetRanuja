import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {DatabaseConfig} from '../../../config';

export default appSchema({
  version: 3,
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
          name: 'Date_at',
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
          name: 'DateAsYearAndMonth',
          type: 'number',
        },
        {
          name: 'Category_Id',
          type: 'string',
        },
      ],
    }),
    tableSchema({
      name: DatabaseConfig.tables.Budget,
      columns: [
        {
          name: 'DateAsYearAndMonth',
          type: 'number',
        },
        {
          name: 'BudgetAmount',
          type: 'number',
        },
      ],
    }),
    tableSchema({
      name: DatabaseConfig.tables.Categories,
      columns: [
        {
          name: 'Category_Id',
          type: 'string',
          isOptional: false,
        },
        {
          name: 'Category_Name',
          type: 'string',
        },
        {
          name: 'IsDeleted',
          type: 'number',
        },
        {
          name: 'ColorCode',
          type: 'string',
        },
        {
          name: 'Category_Type',
          type: 'number',
        },
      ],
    }),
  ],
});
