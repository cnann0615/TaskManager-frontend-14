import { Category } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

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

export const { categoryAdd, categoryUpdate, categoryDelete } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
