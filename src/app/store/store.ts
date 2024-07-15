import { configureStore } from "@reduxjs/toolkit";
import completedTaskItemsReducer from "../slices/completedTaskSlice";
import inCompletedTaskItemsReducer from "../slices/inCompletedTaskSlice";
import categoriesReducer from "../slices/categorySlice";
import schedulesReducer from "../slices/scheduleSlice";

import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    // 完了タスクを管理
    completedTaskItems: completedTaskItemsReducer,
    // 未完了タスクを管理
    inCompletedTaskItems: inCompletedTaskItemsReducer,
    // カテゴリを管理
    categories: categoriesReducer,
    // スケジュールを管理
    schedules: schedulesReducer,
  },
});

// storeのgetStateメソッドの戻り値の型を利用して、アプリケーション全体で利用するRootState型を作成
export type RootState = ReturnType<typeof store.getState>;
// 上記で定義したRootState型を用いて、型情報付きのuseSelectorフックを宣言。これにより、useSelectorがstoreのstateを正しく型推論できるようになる。
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
