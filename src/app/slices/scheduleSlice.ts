import { Schedule } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

// カテゴリState///////////////////////////////////////////////////////////

// 初期値
const initialState: { schedules: Schedule[] } = {
  schedules: [],
};

export const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    // カテゴリ追加
    scheduleAdd: (state, action) => {
      state.schedules.push(action.payload);
    },

    // カテゴリ更新
    scheduleUpdate: (state, action) => {
      // action.payloadからidと更新するデータを取得
      const { id, ...updatedData } = action.payload;
      // 更新するタスクのインデックスを見つける
      const index = state.schedules.findIndex((schedule) => schedule.id === id);
      // インデックスが見つかった場合、そのタスクを更新
      if (index !== -1) {
        state.schedules[index] = {
          ...state.schedules[index],
          ...updatedData,
        };
      }
    },

    // カテゴリ削除
    scheduleDelete: (state, action) => {
      const deleteSchedule = action.payload;
      state.schedules = state.schedules.filter(
        (schedule) => schedule.id !== deleteSchedule.id
      );
    },
  },
});

export const { scheduleAdd, scheduleUpdate, scheduleDelete } =
  schedulesSlice.actions;
export default schedulesSlice.reducer;
