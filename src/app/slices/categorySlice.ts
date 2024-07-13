import { Category } from "../@types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import taskApi from "../api/task";

// カテゴリState///////////////////////////////////////////////////////////

// 初期値
const initialState: Category[] = [];

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // カテゴリ追加
    categoryAdd: (state, action) => {
      state.push(action.payload);
    },

    // カテゴリ更新
    categoryUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.findIndex((category) => category.id === id);
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedData,
        };
      }
    },

    // カテゴリ削除
    categoryDelete: (state, action) => {
      const deleteCategory = action.payload;
      const index = state.findIndex(
        (category) => category.id === deleteCategory.id
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

// ReduxThunk /////////////////////////////////////////////
// 全カテゴリ取得＆Stateに反映
const getAllCategoriesThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: Category) => {
    // カテゴリ取得
    const categories: Category[] = await taskApi.categoryGetAll(payload);
    // 取得したカテゴリをカテゴリStateに反映
    categories.forEach((category) => dispatch(categoryAdd(category)));
  };
};
// 新規カテゴリ登録
const addCategoryThunk = ({
  userId,
  newCategory,
}: {
  userId: string;
  newCategory: Category;
}) => {
  return async (dispatch: Dispatch, getState: Category) => {
    const categoryAddSuccess: Category = await taskApi.categoryAdd(newCategory);
    console.log(categoryAddSuccess);
    if (categoryAddSuccess) {
      const _newCategory: Category = await taskApi.latestCategoryGet(userId);
      dispatch(categoryAdd(_newCategory));
    }
  };
};
// カテゴリ更新
const updateCategoryThunk = (payload: Category) => {
  return async (dispatch: Dispatch, getState: Category) => {
    // DBを更新
    const hoge = await taskApi.updateCategory(payload);
    // Stateを更新
    dispatch(categoryUpdate(payload));
  };
};
// スケジュール削除
const deleteCategoryThunk = (payload: Category) => {
  return async (dispatch: Dispatch, getState: Category) => {
    // DBから削除
    await taskApi.categoryDelete(payload);
    // Stateから削除
    dispatch(categoryUpdate(payload));
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
