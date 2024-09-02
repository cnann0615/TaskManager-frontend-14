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
        (inCompletedTaskItem: TaskItem) => inCompletedTaskItem.id === id
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
      state.forEach((inCompletedTaskItem: TaskItem) => {
        if (inCompletedTaskItem.category.id === updateCategory.id) {
          inCompletedTaskItem.category.name = updateCategory.name;
        }
      });
    },
    // タスクのスケジュール名を更新（特定のスケジュールが割り当てられているものを一括して更新）
    inCompletedTaskUpdateSchedule: (state, action) => {
      const updateSchedule = action.payload;
      state.forEach((inCompletedTaskItem: TaskItem) => {
        if (inCompletedTaskItem.schedule.id === updateSchedule.id) {
          inCompletedTaskItem.schedule.name = updateSchedule.name;
        }
      });
    },
    // タスク削除
    inCompletedTaskDelete: (state, action) => {
      const deleteTask = action.payload;
      const index = state.findIndex(
        (task: TaskItem) => task.id === deleteTask.id
      );
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
    try {
      const inCompletedTaskItems: TaskItem[] = await taskApi.inCompletedTaskGet(
        payload
      );
      inCompletedTaskItems.forEach((inCompletedTaskItem) =>
        dispatch(inCompletedTaskAdd(inCompletedTaskItem))
      );
    } catch (error) {
      console.error("Error fetching incomplete tasks: ", error);
      alert("未完了タスクの取得中にエラーが発生しました。");
    }
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
    try {
      // idが空の状態で新規タスクをDBに登録
      await taskApi.taskAdd(newTask);
      // idが付与された新規タスク（直近に登録されたタスク）をDBから取得
      const _newTask: TaskItem = await taskApi.latestTaskGet(userId);
      // idが付与された状態でRedux Stateに反映
      dispatch(inCompletedTaskAdd(_newTask));
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("未完了タスクの追加中にエラーが発生しました。");
    }
  };
};

// タスク更新をDB,Redux Stateに反映
const updateInCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      await taskApi.updateTask(payload);
      dispatch(inCompletedTaskUpdate(payload));
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("未完了タスクの更新中にエラーが発生しました。");
    }
  };
};

// 未完了→完了処理をDB,Redux Stateに反映（未完了Redux Stateから削除し、完了Redux Stateに登録）
const switchCompletedThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      // 完了フラグを切り替え
      const switchTask: TaskItem = { ...payload, isCompleted: true };
      await taskApi.updateTask(switchTask);
      dispatch(inCompletedTaskDelete(payload));
      dispatch(completedTaskAdd(switchTask));
    } catch (error) {
      console.error("Error switching task to completed: ", error);
      alert("タスクの完了への切り替え中にエラーが発生しました。");
    }
  };
};

// 削除をDB,Redux Stateに反映
const deleteInCompletedTaskItemThunk = (payload: TaskItem) => {
  return async (dispatch: Dispatch, getState: TaskItem) => {
    try {
      await taskApi.taskDelete(payload);
      dispatch(inCompletedTaskDelete(payload));
    } catch (error) {
      console.error("Error deleting task: ", error);
      alert("未完了タスクの削除中にエラーが発生しました。");
    }
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
