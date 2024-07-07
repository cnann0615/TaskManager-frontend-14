import { TaskItem } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

// 完了タスクState///////////////////////////////////////////////////

// 初期値
const initialState: TaskItem[] = [];

export const completedTaskItemsSlice = createSlice({
  name: "completedTaskItems",
  initialState,
  reducers: {
    // タスク追加
    completedTaskAdd: (state, action) => {
      state.push(action.payload);
    },

    // タスク更新
    completedTaskUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.findIndex((task) => task.id === id);
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedData,
        };
      }
    },

    // タスクのカテゴリ名を更新（特定のカテゴリが割り当てられているものを一括して更新）
    completedTaskUpdateCategory: (state, action) => {
      const updateCategory = action.payload;
      state.forEach((completedTaskItem) => {
        if (completedTaskItem.category.id === updateCategory.id) {
          completedTaskItem.category.name = updateCategory.name;
        }
      });
    },
    // タスクのスケジュール名を更新（特定のスケジュールが割り当てられているものを一括して更新）
    completedTaskUpdateSchedule: (state, action) => {
      const updateSchedule = action.payload;
      state.forEach((completedTaskItem) => {
        if (completedTaskItem.schedule.id === updateSchedule.id) {
          completedTaskItem.schedule.name = updateSchedule.name;
        }
      });
    },

    // タスク削除
    completedTaskDelete: (state, action) => {
      const deleteTask = action.payload;
      const index = state.findIndex((task) => task.id === deleteTask.id);
      if (index !== -1) {
        state.splice(index, 1); // stateを直接操作してタスクを削除する
      }
    },
  },
});

export const {
  completedTaskAdd,
  completedTaskUpdate,
  completedTaskUpdateCategory,
  completedTaskUpdateSchedule,
  completedTaskDelete,
} = completedTaskItemsSlice.actions;
export default completedTaskItemsSlice.reducer;
