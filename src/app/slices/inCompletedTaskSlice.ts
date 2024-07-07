import { TaskItem } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

// 未完了タスクState////////////////////////////////////////////////////////////////////

// 初期値
const initialState: TaskItem[] = [];

export const inCompletedTaskItemsSlice = createSlice({
  name: "inCompletedTaskItems",
  initialState,
  reducers: {
    // タスク追加
    inCompletedTaskAdd: (state, action) => {
      state.push(action.payload);
    },

    // タスク更新
    inCompletedTaskUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.findIndex(
        (inCompletedTaskItem) => inCompletedTaskItem.id === id
      );
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedData,
        };
      }
    },

    // タスクのカテゴリ名を更新（特定のカテゴリが割り当てられているものを一括して更新）
    inCompletedTaskUpdateCategory: (state, action) => {
      const updateCategory = action.payload;
      state.forEach((inCompletedTaskItem) => {
        if (inCompletedTaskItem.category.id === updateCategory.id) {
          inCompletedTaskItem.category.name = updateCategory.name;
        }
      });
    },

    // タスクのスケジュール名を更新（特定のスケジュールが割り当てられているものを一括して更新）
    inCompletedTaskUpdateSchedule: (state, action) => {
      const updateSchedule = action.payload;
      state.forEach((inCompletedTaskItem) => {
        if (inCompletedTaskItem.schedule.id === updateSchedule.id) {
          inCompletedTaskItem.schedule.name = updateSchedule.name;
        }
      });
    },

    // タスク削除
    inCompletedTaskDelete: (state, action) => {
      const deleteTask = action.payload;
      const index = state.findIndex((task) => task.id === deleteTask.id);
      if (index !== -1) {
        state.splice(index, 1); // stateを直接操作してタスクを削除する
      }
    },
  },
});

export const {
  inCompletedTaskAdd,
  inCompletedTaskUpdate,
  inCompletedTaskUpdateCategory,
  inCompletedTaskUpdateSchedule,
  inCompletedTaskDelete,
} = inCompletedTaskItemsSlice.actions;

export default inCompletedTaskItemsSlice.reducer;
