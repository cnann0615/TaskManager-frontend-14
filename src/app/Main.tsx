"use client";
import React, { useState, createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import TaskList from "./features/taskList/TaskList";
import TaskDetail from "./features/taskDetails/TaskDetail";
import {
  Category,
  Schedule,
  ShowTaskDetail,
  ShowTaskDetailEditing,
  taskDetailOpen,
  TaskItem,
} from "./@types";
import taskApi from "./api/task";
import { getAllInCompletedTaskItemsThunk } from "./slices/inCompletedTaskSlice";
import { getAllCompletedTaskItemsThunk } from "./slices/completedTaskSlice";
import { getAllCategoriesThunk } from "./slices/categorySlice";
import { getAllSchedulesThunk } from "./slices/scheduleSlice";
import NewContents from "./features/newContents/NewContents";
import Account from "./features/account/Account";

// 詳細表示対象タスクContextを作成
export const showTaskDetailContext = createContext<ShowTaskDetail>({
  showTaskDetail: null, //初期値はnull
  setShowTaskDetail: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

// 詳細表示対象タスク編集状態管理Contextを作成
export const showTaskDetailEditingContext =
  createContext<ShowTaskDetailEditing>({
    showTaskDetailEditing: null, //初期値はnull
    setShowTaskDetailEditing: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
  });

// 詳細表示画面展開Contextを作成
export const taskDetailOpenContext = createContext<taskDetailOpen>({
  taskDetailOpen: false, //初期値はfalse
  setTaskDetailOpen: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

export default function Main() {
  // サインイン情報取得
  const userId = auth.currentUser!.uid;

  // Reduxのdispatchを使用可能にする
  const dispatch = useDispatch();

  // New Contents画面展開State定義
  const [addOpen, setAddOpen] = useState(true);

  // 詳細表示タスクState定義
  const [showTaskDetail, setShowTaskDetail] = useState<TaskItem | any>(null);

  // 詳細表示タスク編集状態管理State定義
  const [showTaskDetailEditing, setShowTaskDetailEditing] =
    useState<boolean>(false);

  // 詳細表示画面展開State定義
  const [taskDetailOpen, setTaskDetailOpen] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        //　カテゴリとスケジュールの初期値「None」をDBに登録
        const defaultCategory: Category = {
          userId: userId,
          name: "None",
          orderIndex: 1,
        };
        const defaultSchedule: Schedule = {
          userId: userId,
          name: "None",
          orderIndex: 1,
        };
        await taskApi.categoryAdd(defaultCategory);
        await taskApi.scheduleAdd(defaultSchedule);

        // APIから未完了タスク、完了タスク、カテゴリ、スケジュールを取得＆各Redux Stateに反映
        dispatch(getAllInCompletedTaskItemsThunk(userId));
        dispatch(getAllCompletedTaskItemsThunk(userId));
        dispatch(getAllCategoriesThunk(userId));
        dispatch(getAllSchedulesThunk(userId));
      } catch (err) {
        console.error("Error fetching data: ", err);
        alert(
          "データの取得中にエラーが発生しました。しばらくしてからもう一度お試しください。"
        );
      }
    })();
  }, [dispatch, userId]);

  return (
    <>
      {/* 詳細表示タスクStateはメインページ内の全コンポーネントで使用 */}
      <showTaskDetailContext.Provider
        value={{ showTaskDetail, setShowTaskDetail }}
      >
        <main className=" mx-10 md:mx-20 my-4">
          {/* アカウント情報表示 */}
          <Account />
          <div className=" bg-gray-50 mx-auto my-4 p-4 border rounded-lg shadow">
            <div>
              <div className=" flex items-center gap-2 text-blue-500 text-2xl m-2 font-bold">
                <TbCategoryPlus size={35} />
                {/* New Contents画面の展開ボタン */}
                <h1>New Contents</h1>
                <button
                  onClick={() => {
                    setAddOpen(!addOpen);
                  }}
                  className=""
                >
                  {addOpen ? (
                    <MdOutlineExpandLess size={35} />
                  ) : (
                    <MdOutlineExpandMore size={35} />
                  )}
                </button>
              </div>
            </div>
            {/* New Contents画面が展開されている時は、New Task, New Category, New Scheduleフォームを表示 */}
            {addOpen ? <NewContents /> : ""}
          </div>
          {/* 詳細表示画面展開Stateと、詳細表示タスク編集状態管理Stateは、Task List、Task Detailコンポーネントで使用。 */}
          <taskDetailOpenContext.Provider
            value={{ taskDetailOpen, setTaskDetailOpen }}
          >
            <showTaskDetailEditingContext.Provider
              value={{ showTaskDetailEditing, setShowTaskDetailEditing }}
            >
              <div className="xl:flex xl:gap-8">
                {/* Task List画面 */}
                <TaskList />
                {/* Task Detail画面 */}
                <TaskDetail />
              </div>
            </showTaskDetailEditingContext.Provider>
          </taskDetailOpenContext.Provider>
        </main>
      </showTaskDetailContext.Provider>
    </>
  );
}
