import { TaskItem } from "../@types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import taskApi from "../api/task";
import { inCompletedTaskAdd } from "./inCompletedTaskSlice";


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

// ReduxThunk 完了タスク取得＆Stateに反映
const getAllCompletedTaskItemsThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    // 完了タスク取得
    const completedTaskItems: TaskItem[] = await taskApi.completedTaskGet(
      payload
    );
    // 取得した完了タスクを完了タスクStateに反映
    completedTaskItems.forEach((completedTaskItem) =>
      dispatch(completedTaskAdd(completedTaskItem))
    );
  };
};
// タスク更新をDB,Stateに反映
const updateCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(completedTaskUpdate(payload));
    await taskApi.updateTask(payload);
  };
};
// 完了→未完了処理をDB,Stateに反映
const switchInCompletedThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(completedTaskDelete(payload));
    const switchTask = { ...payload, isCompleted: false };
    dispatch(inCompletedTaskAdd(switchTask));
    await taskApi.updateTask(switchTask);
  };
};

// 削除をDB,Stateに反映
const deleteCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(completedTaskDelete(payload));
    await taskApi.taskDelete(payload);
  };
};

export {
  getAllCompletedTaskItemsThunk,
  updateCompletedTaskItemThunk,
  switchInCompletedThunk,
  deleteCompletedTaskItemThunk,
};

export const {
  completedTaskAdd,
  completedTaskUpdate,
  completedTaskUpdateCategory,
  completedTaskUpdateSchedule,
  completedTaskDelete,
} = completedTaskItemsSlice.actions;
export default completedTaskItemsSlice.reducer;
