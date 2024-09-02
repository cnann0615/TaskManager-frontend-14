import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { TaskItem } from "../@types";
import taskApi from "../api/task";
import { inCompletedTaskAdd } from "./inCompletedTaskSlice";

// 完了タスクRedux State///////////////////////////////////////////////////

// 初期値
const initialState: TaskItem[] = [];

export const completedTaskItemsSlice = createSlice({
  name: "completedTaskItems",
  initialState,
  reducers: {
    // 追加
    completedTaskAdd: (state, action) => {
      state.push(action.payload);
    },

    // 更新
    completedTaskUpdate: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.findIndex((task: TaskItem) => task.id === id);
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
      state.forEach((completedTaskItem: TaskItem) => {
        if (completedTaskItem.category.id === updateCategory.id) {
          completedTaskItem.category.name = updateCategory.name;
        }
      });
    },
    // タスクのスケジュール名を更新（特定のスケジュールが割り当てられているものを一括して更新）
    completedTaskUpdateSchedule: (state, action) => {
      const updateSchedule = action.payload;
      state.forEach((completedTaskItem: TaskItem) => {
        if (completedTaskItem.schedule.id === updateSchedule.id) {
          completedTaskItem.schedule.name = updateSchedule.name;
        }
      });
    },

    // タスク削除
    completedTaskDelete: (state, action) => {
      const deleteTask = action.payload;
      const index = state.findIndex(
        (task: TaskItem) => task.id === deleteTask.id
      );
      if (index !== -1) {
        state.splice(index, 1); // stateを直接操作してタスクを削除する
      }
    },
  },
});

// ReduxThunk //////////////////////////////
///DBから完了タスク取得＆Redux Stateに反映
const getAllCompletedTaskItemsThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      const completedTaskItems: TaskItem[] = await taskApi.completedTaskGet(
        payload
      );
      completedTaskItems.forEach((completedTaskItem) =>
        dispatch(completedTaskAdd(completedTaskItem))
      );
    } catch (error) {
      console.error("Error fetching completed tasks: ", error);
      alert("完了タスクの取得中にエラーが発生しました。");
    }
  };
};

// タスク更新をDB,Redux Stateに反映
const updateCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      await taskApi.updateTask(payload);
      dispatch(completedTaskUpdate(payload));
    } catch (error) {
      console.error("Error updating completed task: ", error);
      alert("完了タスクの更新中にエラーが発生しました。");
    }
  };
};

// 完了→未完了処理をDB,Redux Stateに反映（完了Redux Stateから削除し、未完了Redux Stateに登録）
const switchInCompletedThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      // 完了フラグを切り替え
      const switchTask = { ...payload, isCompleted: false };
      await taskApi.updateTask(switchTask);
      dispatch(completedTaskDelete(payload));
      dispatch(inCompletedTaskAdd(switchTask));
    } catch (error) {
      console.error("Error switching task to incomplete: ", error);
      alert("タスクの未完了への切り替え中にエラーが発生しました。");
    }
  };
};

// 削除をDB,Redux Stateに反映
const deleteCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      await taskApi.taskDelete(payload);
      dispatch(completedTaskDelete(payload));
    } catch (error) {
      console.error("Error deleting completed task: ", error);
      alert("完了タスクの削除中にエラーが発生しました。");
    }
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
