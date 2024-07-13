import { TaskItem } from "../@types";
import { Dispatch, createSlice } from "@reduxjs/toolkit";
import taskApi from "../api/task";
import {
  completedTaskAdd,
  completedTaskItemsSlice,
} from "./completedTaskSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

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

// ReduxThunk ///////////////////////////
// 全タスク取得＆Stateに反映
const getAllInCompletedTaskItemsThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    // 未完了タスク取得
    const inCompletedTaskItems: TaskItem[] = await taskApi.inCompletedTaskGet(
      payload
    );
    // 取得した未完了タスクを未完了タスクStateに反映
    inCompletedTaskItems.forEach((inCompletedTaskItem) =>
      dispatch(inCompletedTaskAdd(inCompletedTaskItem))
    );
  };
};
// 新規タスクをDB,Stateに反映
const addInCompletedTaskItemThunk = ({
  userId,
  newTask,
}: {
  userId: string;
  newTask: TaskItem;
}) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    await taskApi.taskAdd(newTask);
    const _newTask: TaskItem = await taskApi.latestTaskGet(userId);
    dispatch(inCompletedTaskAdd(_newTask));
  };
};
// タスク更新をDB,Stateに反映
const updateInCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(inCompletedTaskUpdate(payload));
    await taskApi.updateTask(payload);
  };
};
// 未完了→完了処理をDB,Stateに反映
const switchCompletedThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    dispatch(inCompletedTaskDelete(payload));
    const switchTask: TaskItem = { ...payload, isCompleted: true };
    dispatch(completedTaskAdd(switchTask));
    await taskApi.updateTask(switchTask);
  };
};
// 削除をDB,Stateに反映
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
