import { TaskItem } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

// 未完了タスクState////////////////////////////////////////////////////////////////////

// 初期値
const initialState: { inCompletedTaskItems: TaskItem[] } = {
  inCompletedTaskItems: [],
};

export const inCompletedTaskItemsSlice = createSlice({
  name: "inCompletedTaskItems",
  initialState,
  reducers: {
    // タスク追加
    inCompletedTaskAdd: (state, action) => {
      state.inCompletedTaskItems.push(action.payload);
    },

    // タスク更新
    inCompletedTaskUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.inCompletedTaskItems.findIndex(
        (inCompletedTaskItem) => inCompletedTaskItem.id === id
      );
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state.inCompletedTaskItems[index] = {
          ...state.inCompletedTaskItems[index],
          ...updatedData,
        };
      }
    },

    // タスクのカテゴリ名を更新（特定のカテゴリが割り当てられているものを一括して更新）
    inCompletedTaskUpdateCategory: (state, action) => {
      const updateCategory = action.payload;
      state.inCompletedTaskItems.forEach((inCompletedTaskItem) => {
        if (inCompletedTaskItem.category.id === updateCategory.id) {
          inCompletedTaskItem.category.name = updateCategory.name;
        }
      });
    },

    // タスク削除
    inCompletedTaskDelete: (state, action) => {
      const deleteTask = action.payload;
      state.inCompletedTaskItems = state.inCompletedTaskItems.filter(
        (inCompletedTaskItem) => inCompletedTaskItem.id !== deleteTask.id
      );
    },
  },
});

export const {
  inCompletedTaskAdd,
  inCompletedTaskUpdate,
  inCompletedTaskUpdateCategory,
  inCompletedTaskDelete,
} = inCompletedTaskItemsSlice.actions;

export default inCompletedTaskItemsSlice.reducer;
