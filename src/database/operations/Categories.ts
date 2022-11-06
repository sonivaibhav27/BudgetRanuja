import {Q} from '@nozbe/watermelondb';
import {WatermenlonDB} from '../../..';
import {CategoriesTypes} from '../../types';
import Utils from '../../app/utils';
import {MAX_CATERGORY_ALLOWED, TABLES} from '../db.config';
import {Data} from '../../app/assets';
class Category {
  static _rawDictionary: {[key: string]: [string, string]};
  static colorCategoriesFromBackend = null;
  static getDictionary() {
    return this._rawDictionary;
  }
  static getDBCollection() {
    return WatermenlonDB.collections.get(TABLES.Categories);
  }
  static async UploadAllCategoriesInDB() {
    const expenseCategories = Data.ExpenseCategories;
    let expenseCategoriesPrepareCreate = expenseCategories.map(category => {
      return WatermenlonDB.collections
        .get(TABLES.Categories)
        .prepareCreate((model: CategoriesTypes.TCategoriesDatabaseModel) => {
          model.CategoryId = Utils.generateUUID();
          model.CategoryName = category.categoryName;
          model.IsDeleted = 0;
          model.CategoryColorCode = category.color;
          model.CategoryType = 2;
        });
    });
    let incomeCategoriesPrepareCreate = Data.IncomeCategories.map(category => {
      return WatermenlonDB.collections
        .get(TABLES.Categories)
        .prepareCreate((model: CategoriesTypes.TCategoriesDatabaseModel) => {
          model.CategoryId = Utils.generateUUID();
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
      Utils.makeToast(
        'Failed to insert initial data into Database, Kindly Press Ok.',
      );
      return false;
    }
  }

  static createCategoryDictionary(categories: CategoriesTypes.TCategories[]) {
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

  static async getAllCategories(): Promise<
    CategoriesTypes.TCategories[] | undefined
  > {
    try {
      const categoryData: CategoriesTypes.TCategoriesDatabaseModel[] =
        await this.getDBCollection().query().fetch();
      let santitizeCategoryData: CategoriesTypes.TCategories[] =
        categoryData.map((data: CategoriesTypes.TCategoriesDatabaseModel) => {
          return {
            CategoryId: data.CategoryId!,
            CategoryName: data.CategoryName!,
            CategoryColorCode: data.CategoryColorCode!,
            IsDeleted: data.IsDeleted!,
            CategoryType: data.CategoryType! === 1 ? 'income' : 'expense',
          };
        });
      this.createCategoryDictionary(santitizeCategoryData);
      return santitizeCategoryData;
    } catch (err) {
      Utils.makeToast(
        'Error occur while loading categories, kindly reload the app.',
      );
    }
  }

  static async saveCategory(
    categoryName: string,
    type: 'expense' | 'income',
    color: string,
    isPremiumUser: boolean = false,
  ) {
    if (categoryName.length === 0) {
      Utils.makeToast("Can't save empty category name.", 'SHORT');
      return;
    }
    const categoryId = Utils.generateUUID();
    const prevCategoryLength = await this.getDBCollection()
      .query()
      .fetchCount();

    if (!isPremiumUser && prevCategoryLength >= MAX_CATERGORY_ALLOWED) {
      Utils.makeToast(`Total Categories allowed are ${MAX_CATERGORY_ALLOWED}`);
      return;
    }
    const categoryType = type === 'expense' ? 2 : 1;
    try {
      await WatermenlonDB.write(async () => {
        this.getDBCollection().create(
          (model: CategoriesTypes.TCategoriesDatabaseModel) => {
            model.CategoryId = categoryId;
            model.CategoryName = categoryName;
            model.CategoryType = categoryType;
            model.IsDeleted = 0;
            model.CategoryColorCode = type === 'expense' ? color : '';
          },
        );
      });
      return await this.getAllCategories();
    } catch (err: any) {
      if (err.name === 'Diagnostic Error') {
        Utils.makeToast('Something went failed with database ' + err.message);
        return null;
      }
      Utils.makeToast(err.message);
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
          await category[0].update(
            (model: CategoriesTypes.TCategoriesDatabaseModel) => {
              model.IsDeleted = 1;
            },
          );
        });
        Utils.makeToast('Successfully deleted.');
      }
    } catch (err: any) {
      Utils.makeToast('Error while Deleting' + err.message, 'LONG');
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
      Utils.makeToast("New category can't be empty");
      return;
    }
    try {
      const getCategoryFromDB = await this.getDBCollection()
        .query(Q.where('Category_Id', Q.eq(categoryId)))
        .fetch();
      if (getCategoryFromDB.length > 1) {
        Utils.makeToast('Found more than one Categories with same Id');
        return;
      }
      if (getCategoryFromDB.length === 0) {
        return;
      }
      await WatermenlonDB.write(async () => {
        getCategoryFromDB[0].update(
          (category: CategoriesTypes.TCategoriesDatabaseModel) => {
            category.CategoryName = newCategoryName;
            category.CategoryColorCode = categoryColor;
          },
        );
      });
      // new object to reflect changed category name with other screen.
      delete this._rawDictionary[categoryId];
      this._rawDictionary = {
        ...this._rawDictionary,
        [categoryId]: [newCategoryName, categoryColor],
      };
      Utils.makeToast('Updated Successfully');
      return true;
    } catch (err) {
      console.log(err);
      Utils.makeToast('Failed to save category, please try again.');
      return false;
    }
  }
}

export default Category;
