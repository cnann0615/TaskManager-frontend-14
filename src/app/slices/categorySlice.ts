import { Category } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

// カテゴリState///////////////////////////////////////////////////////////

// 初期値
const initialState: { categories: Category[] } = {
  categories: [],
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // カテゴリ追加
    categoryAdd: (state, action) => {
      state.categories.push(action.payload);
    },

    // カテゴリ更新
    categoryUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.categories.findIndex(
        (category) => category.id === id
      );
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...updatedData,
        };
      }
    },

    // カテゴリ削除
    categoryDelete: (state, action) => {
      const deleteCategory = action.payload;
      state.categories = state.categories.filter(
        (category) => category.id !== deleteCategory.id
      );
    },
  },
});

export const { categoryAdd, categoryUpdate, categoryDelete } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
