import { createSlice, Dispatch } from "@reduxjs/toolkit";

import { Schedule } from "../@types";
import taskApi from "../api/task";

// スケジュールRedux State///////////////////////////////////////////////////////////

// 初期値
const initialState: Schedule[] = [];

export const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    // 追加
    scheduleAdd: (state, action) => {
      state.push(action.payload);
    },
    // 更新
    scheduleUpdate: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.findIndex((schedule) => schedule.id === id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedData,
        };
      }
    },

    // 削除
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
// DBから全スケジュール取得＆Redux Stateに反映
const getAllSchedulesThunk = (payload: string) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    const schedules: Schedule[] = await taskApi.scheduleGetAll(payload);
    schedules.forEach((schedule) => dispatch(scheduleAdd(schedule)));
  };
};
// 新規スケジュール登録（DB, Rudex State)
const addScheduleThunk = ({
  userId,
  newSchedule,
}: {
  userId: string;
  newSchedule: Schedule;
}) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    // idが空の状態の新規スケジュールをDBに登録し、結果を得る
    const scheduleAddSuccess: Schedule = await taskApi.scheduleAdd(newSchedule);
    // 登録成功した場合、idが付与された新規スケジュール（直近に登録されたスケジュール）をDBから取得
    if (scheduleAddSuccess) {
      const _newSchedule: Schedule = await taskApi.latestScheduleGet(userId);
      // idが付与された状態でRedux Stateに反映
      dispatch(scheduleAdd(_newSchedule));
    }
  };
};
// スケジュール更新
const updateScheduleThunk = (payload: Schedule) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    await taskApi.updateSchedule(payload);
    dispatch(scheduleUpdate(payload));
  };
};
// スケジュール削除
const deleteScheduleThunk = (payload: Schedule) => {
  return async (dispatch: Dispatch, getState: Schedule) => {
    await taskApi.scheduleDelete(payload);
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
