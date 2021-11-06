import React from 'react';
import {WatermenlonDB} from '../..';
import {ExpenseCategories} from '../data';

export default () => {
  const checkAndIntitalizeCategories = async () => {
    const _getCategories = await WatermenlonDB.adapter.getLocal('_categories');
    if (_getCategories) {
    }
  };
  React.useEffect(() => {
    checkAndIntitalizeCategories();
  }, []);

  return ExpenseCategories;
};
