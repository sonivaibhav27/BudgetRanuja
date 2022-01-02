import {Q} from '@nozbe/watermelondb';
import {ExpenseCategories} from './../../data';
import {WatermenlonDB} from '../../..';
import {DatabaseConfig} from '../../config';
import {Miscellaneous, Toast} from '../../utils';
import IncomeCategories from '../../data/IncomeCategories';
import {TCategoryType, CategoryModelType} from '../../types';

const MAX_CATERGORY_ALLOWED = 16;
class Category {
  static _rawDictionary: {[key: string]: [string, string]};
  static colorCategoriesFromBackend = null;
  static getDictionary() {
    return this._rawDictionary;
  }
  static getDBCollection() {
    return WatermenlonDB.collections.get(DatabaseConfig.tables.Categories);
  }
  static async UploadAllCategoriesInDB() {
    const expenseCategories = ExpenseCategories;
    let expenseCategoriesPrepareCreate = expenseCategories.map(category => {
      return WatermenlonDB.collections
        .get(DatabaseConfig.tables.Categories)
        .prepareCreate((model: CategoryModelType) => {
          model.CategoryId = Miscellaneous.GenerateUUID();
          model.CategoryName = category.categoryName;
          model.IsDeleted = 0;
          model.CategoryColorCode = category.color;
          model.CategoryType = 2;
        });
    });
    let incomeCategoriesPrepareCreate = IncomeCategories.map(category => {
      return WatermenlonDB.collections
        .get(DatabaseConfig.tables.Categories)
        .prepareCreate((model: CategoryModelType) => {
          model.CategoryId = Miscellaneous.GenerateUUID();
          model.CategoryName = category.categoryName;
          model.IsDeleted = 0;
          model.CategoryColorCode = '';
          model.CategoryType = 1;
        });
    });
    let bulkUploadList = [
      ...expenseCategoriesPrepareCreate,
      ...incomeCategoriesPrepareCreate,
    ];
    try {
      await WatermenlonDB.write(async () => {
        await WatermenlonDB.batch(...bulkUploadList);
      });
      return true;
    } catch (err) {
      Toast('Failed to insert initial data into Database, Kindly Press Ok.');
      return false;
    }
  }

  static createCategoryDictionary(categories: TCategoryType[]) {
    let map: {[key: string]: [string, string]} = {};
    categories.map(category => {
      map[category.CategoryId!] = [
        category.CategoryName!,
        category.CategoryColorCode!,
      ];
    });
    this._rawDictionary = map;
    return map;
  }

  static async getAllCategories(): Promise<TCategoryType[] | undefined> {
    try {
      const categoryData: CategoryModelType[] = await this.getDBCollection()
        .query()
        .fetch();
      let santitizeCategoryData: TCategoryType[] = categoryData.map(
        (data: CategoryModelType) => {
          return {
            CategoryId: data.CategoryId!,
            CategoryName: data.CategoryName!,
            CategoryColorCode: data.CategoryColorCode!,
            IsDeleted: data.IsDeleted!,
            CategoryType: data.CategoryType! === 1 ? 'income' : 'expense',
          };
        },
      );
      this.createCategoryDictionary(santitizeCategoryData);
      return santitizeCategoryData;
    } catch (err) {
      Toast('Error occur while loading categories, kindly reload the app.');
    }
  }

  static async saveCategory(
    categoryName: string,
    type: 'expense' | 'income',
    color: string,
  ) {
    if (categoryName.length === 0) {
      Toast("Can't save empty category name.", 'SHORT');
      return;
    }
    const categoryId = Miscellaneous.GenerateUUID();
    const prevCategoryLength = await this.getDBCollection()
      .query()
      .fetchCount();

    if (prevCategoryLength >= MAX_CATERGORY_ALLOWED) {
      Toast(`Total Categories allowed are ${MAX_CATERGORY_ALLOWED}`);
      return;
    }
    const categoryType = type === 'expense' ? 2 : 1;
    try {
      await WatermenlonDB.write(async () => {
        this.getDBCollection().create((model: CategoryModelType) => {
          model.CategoryId = categoryId;
          model.CategoryName = categoryName;
          model.CategoryType = categoryType;
          model.IsDeleted = 0;
          model.CategoryColorCode = type === 'expense' ? color : '';
        });
      });
      return await this.getAllCategories();
    } catch (err) {
      if (err.name === 'Diagnostic Error') {
        Toast('Something went failed with database ' + err.message);
        return null;
      }
      Toast(err.message);
      return null;
    }
  }

  static async deleteCategory(categoryId: string) {
    if (categoryId.length === 0) {
      return;
    }
    try {
      const category = await this.getDBCollection()
        .query(Q.where('Category_Id', Q.eq(categoryId)))
        .fetch();
      if (category.length === 1) {
        await WatermenlonDB.write(async () => {
          await category[0].update((model: CategoryModelType) => {
            model.IsDeleted = 1;
          });
        });
        Toast('Successfully deleted.');
      }
    } catch (err) {
      Toast('Error while Deleting' + err.message, 'LONG');
    }
  }

  static async updateCategory(
    categoryId: string,
    newCategoryName: string,
    categoryColor: string,
  ) {
    if (categoryId.length === 0) {
      return;
    }
    if (newCategoryName.length === 0) {
      Toast("New category can't be empty");
      return;
    }
    try {
      const getCategoryFromDB = await this.getDBCollection()
        .query(Q.where('Category_Id', Q.eq(categoryId)))
        .fetch();
      if (getCategoryFromDB.length > 1) {
        Toast('Found more than one Categories with same Id');
        return;
      }
      if (getCategoryFromDB.length === 0) {
        return;
      }
      await WatermenlonDB.write(async () => {
        getCategoryFromDB[0].update((category: CategoryModelType) => {
          category.CategoryName = newCategoryName;
          category.CategoryColorCode = categoryColor;
        });
      });
      // new object to reflect changed category name with other screen.
      delete this._rawDictionary[categoryId];
      this._rawDictionary = {
        ...this._rawDictionary,
        [categoryId]: [newCategoryName, categoryColor],
      };
      Toast('Updated Successfully');
      return true;
    } catch (err) {
      console.log(err);
      Toast('Failed to save category, please try again.');
      return false;
    }
  }
}

export default Category;
