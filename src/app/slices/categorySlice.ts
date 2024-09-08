import { createSlice, Dispatch } from "@reduxjs/toolkit";

import { Category } from "../@types";
import taskApi from "../api/task";

// カテゴリState///////////////////////////////////////////////////////////

// 初期値
const initialState: Category[] = [];

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // 追加
    categoryAdd: (state, action) => {
      state.push(action.payload);
    },

    // 更新
    categoryUpdate: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.findIndex((category: Category) => category.id === id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedData,
        };
      }
    },

    // 削除
    categoryDelete: (state, action) => {
      const deleteCategory = action.payload;
      const index = state.findIndex(
        (category: Category) => category.id === deleteCategory.id
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

// ReduxThunk /////////////////////////////////////////////
// DBから全カテゴリ取得＆Redux Stateに反映
const getAllCategoriesThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: Category) => {
    try {
      const categories: Category[] = await taskApi.categoryGetAll(payload);
      categories.forEach((category) => dispatch(categoryAdd(category)));
    } catch (error) {
      console.error("Error fetching categories: ", error);
      alert("カテゴリの取得中にエラーが発生しました。");
    }
  };
};

// 新規カテゴリ登録（DB, Rudex State)
const addCategoryThunk = ({
  userId,
  newCategory,
}: {
  userId: string;
  newCategory: Category;
}) => {
  return async (dispatch: Dispatch, getState: Category) => {
    try {
      // idが空の状態の新規カテゴリをDBに登録し、結果を得る
      const categoryAddSuccess: Category = await taskApi.categoryAdd(
        newCategory
      );
      // 登録成功した場合、idが付与された新規カテゴリ（直近に登録されたカテゴリ）をDBから取得
      if (categoryAddSuccess) {
        const _newCategory: Category = await taskApi.latestCategoryGet(userId);
        // idが付与された状態でRedux Stateに反映
        dispatch(categoryAdd(_newCategory));
      }
    } catch (error) {
      console.error("Error adding category: ", error);
      alert("カテゴリの追加中にエラーが発生しました。");
    }
  };
};

// カテゴリ更新
const updateCategoryThunk = (payload: Category) => {
  return async (dispatch: Dispatch, getState: Category) => {
    try {
      await taskApi.updateCategory(payload);
      dispatch(categoryUpdate(payload));
    } catch (error) {
      console.error("Error updating category: ", error);
      alert("カテゴリの更新中にエラーが発生しました。");
    }
  };
};

// カテゴリ削除
const deleteCategoryThunk = (payload: Category) => {
  return async (dispatch: Dispatch, getState: Category) => {
    try {
      await taskApi.categoryDelete(payload);
      dispatch(categoryDelete(payload));
    } catch (error) {
      console.error("Error deleting category: ", error);
      alert("カテゴリの削除中にエラーが発生しました。");
    }
  };
};

export {
  getAllCategoriesThunk,
  addCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
};

export const { categoryAdd, categoryUpdate, categoryDelete } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
