import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {TABLES, DBVERSION} from '../../db.config';

export default appSchema({
  version: DBVERSION,
  tables: [
    // We'll add tableSchemas here later
    tableSchema({
      name: TABLES.BudgetBills,
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
      name: TABLES.Budget,
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
      name: TABLES.Categories,
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
