import { Schedule } from "../@types";
import { createSlice } from "@reduxjs/toolkit";

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

export const { scheduleAdd, scheduleUpdate, scheduleDelete } =
  schedulesSlice.actions;
export default schedulesSlice.reducer;
