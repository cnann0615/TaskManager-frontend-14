import { Dispatch, createSlice } from "@reduxjs/toolkit";

import { TaskItem } from "../@types";
import taskApi from "../api/task";
import { completedTaskAdd } from "./completedTaskSlice";

// 未完了タスクRedux State////////////////////////////////////////////////////////////////////

// 初期値
const initialState: TaskItem[] = [];

export const inCompletedTaskItemsSlice = createSlice({
  name: "inCompletedTaskItems",
  initialState,
  reducers: {
    // 追加
    inCompletedTaskAdd: (state, action) => {
      state.push(action.payload);
    },
    // 更新
    inCompletedTaskUpdate: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.findIndex(
        (inCompletedTaskItem) => inCompletedTaskItem.id === id
      );
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
        state.splice(index, 1);
      }
    },
  },
});

// ReduxThunk ///////////////////////////
// DBから全タスク取得＆Redux Stateに反映
const getAllInCompletedTaskItemsThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    const inCompletedTaskItems: TaskItem[] = await taskApi.inCompletedTaskGet(
      payload
    );
    inCompletedTaskItems.forEach((inCompletedTaskItem) =>
      dispatch(inCompletedTaskAdd(inCompletedTaskItem))
    );
  };
};
// 新規タスクをDB,Redux Stateに反映
const addInCompletedTaskItemThunk = ({
  userId,
  newTask,
}: {
  userId: string;
  newTask: TaskItem;
}) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    // idが空の状態で新規タスクをDBに登録
    await taskApi.taskAdd(newTask);
    // idが付与された新規タスク（直近に登録されたタスク）をDBから取得
    const _newTask: TaskItem = await taskApi.latestTaskGet(userId);
    dispatch(inCompletedTaskAdd(_newTask));
    // idが付与された状態でRedux Stateに反映
  };
};
// タスク更新をDB,Redux Stateに反映
const updateInCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(inCompletedTaskUpdate(payload));
    await taskApi.updateTask(payload);
  };
};
// 未完了→完了処理をDB,Redux Stateに反映（未完了Redux Stateから削除し、完了Reduc Stateに登録）
const switchCompletedThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(inCompletedTaskDelete(payload));
    // 完了フラグを切り替え
    const switchTask: TaskItem = { ...payload, isCompleted: true };
    dispatch(completedTaskAdd(switchTask));
    await taskApi.updateTask(switchTask);
  };
};
// 削除をDB,Redux Stateに反映
const deleteInCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(inCompletedTaskDelete(payload));
    await taskApi.taskDelete(payload);
  };
};

export {
  getAllInCompletedTaskItemsThunk,
  addInCompletedTaskItemThunk,
  updateInCompletedTaskItemThunk,
  switchCompletedThunk,
  deleteInCompletedTaskItemThunk,
};

export const {
  inCompletedTaskAdd,
  inCompletedTaskUpdate,
  inCompletedTaskUpdateCategory,
  inCompletedTaskUpdateSchedule,
  inCompletedTaskDelete,
} = inCompletedTaskItemsSlice.actions;

export default inCompletedTaskItemsSlice.reducer;
