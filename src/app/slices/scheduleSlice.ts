import { Schedule } from "../@types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import taskApi from "../api/task";
import { SetFieldValue } from "react-hook-form";

// カテゴリState///////////////////////////////////////////////////////////

// 初期値
const initialState: Schedule[] = [];

export const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    // カテゴリ追加
    scheduleAdd: (state, action) => {
      state.push(action.payload);
    },

    // カテゴリ更新
    scheduleUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.findIndex((schedule) => schedule.id === id);
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedData,
        };
      }
    },

    // カテゴリ削除
    scheduleDelete: (state, action) => {
      const deleteSchedule = action.payload;
      const index = state.findIndex(
        (schedule) => schedule.id === deleteSchedule.id
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

// ReduxThunk //////////////////////////////
// 全スケジュール取得＆Stateに反映
const getAllSchedulesThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    // DBから取得
    const schedules: Schedule[] = await taskApi.scheduleGetAll(payload);
    // 取得したカテゴリをStateに反映
    schedules.forEach((schedule) => dispatch(scheduleAdd(schedule)));
  };
};
// 新規スケジュール登録
const addScheduleThunk = ({
  userId,
  newSchedule,
}: {
  userId: string;
  newSchedule: Schedule;
}) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    const scheduleAddSuccess: Schedule = await taskApi.scheduleAdd(newSchedule);
    if (scheduleAddSuccess) {
      const _newSchedule: Schedule = await taskApi.latestScheduleGet(userId);
      dispatch(scheduleAdd(_newSchedule));
    }
  };
};
// カテゴリ更新
const updateScheduleThunk = (payload: Schedule) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    // DBを更新
    await taskApi.updateSchedule(payload);
    // Stateを更新
    dispatch(scheduleUpdate(payload));
  };
};
// スケジュール削除
const deleteScheduleThunk = (payload: Schedule) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    // DBから削除
    const hoge = await taskApi.scheduleDelete(payload);
    // Stateから削除
    dispatch(scheduleDelete(payload));
  };
};

export {
  getAllSchedulesThunk,
  addScheduleThunk,
  updateScheduleThunk,
  deleteScheduleThunk,
};

export const { scheduleAdd, scheduleUpdate, scheduleDelete } =
  schedulesSlice.actions;
export default schedulesSlice.reducer;
