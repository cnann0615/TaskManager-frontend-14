"use client";
import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";

import TaskList from "./features/taskList/TaskList";
import TaskDetail from "./features/taskDetails/TaskDetail";
import { Category, Schedule, TaskItem } from "./@types";
import taskApi from "./api/task";
import { getAllInCompletedTaskItemsThunk } from "./slices/inCompletedTaskSlice";
import {
  completedTaskAdd,
  getAllCompletedTaskItemsThunk,
} from "./slices/completedTaskSlice";
import { categoryAdd, getAllCategoriesThunk } from "./slices/categorySlice";
import { getAllSchedulesThunk, scheduleAdd } from "./slices/scheduleSlice";
import NewContents from "./features/newContents/NewContents";
import Account from "./features/account/Account";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// 詳細表示対象Contextで使用する型を定義
type ShowTaskDetail = {
  showTaskDetail: TaskItem | any;
  setShowTaskDetail: Dispatch<SetStateAction<TaskItem | any>>;
};

// 詳細表示対象タスクContextを作成
export const showTaskDetailContext = createContext<ShowTaskDetail>({
  showTaskDetail: null,
  setShowTaskDetail: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

// 詳細表示対象タスク編集状態管理Contextで使用する型を定義
type ShowTaskDetailEditing = {
  showTaskDetailEditing: TaskItem | any;
  setShowTaskDetailEditing: Dispatch<SetStateAction<TaskItem | any>>;
};

// 詳細表示対象タスク編集状態管理Contextを作成
export const showTaskDetailEditingContext =
  createContext<ShowTaskDetailEditing>({
    showTaskDetailEditing: null,
    setShowTaskDetailEditing: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
  });

// 詳細表示展開Contextで使用する型を定義
type taskDetailOpen = {
  taskDetailOpen: boolean;
  setTaskDetailOpen: Dispatch<SetStateAction<boolean>>;
};

// 詳細表示展開Contextを作成
export const taskDetailOpenContext = createContext<taskDetailOpen>({
  taskDetailOpen: false,
  setTaskDetailOpen: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

export default function Main() {
  const [user] = useAuthState(auth);
  const userId = auth.currentUser!.uid;

  // ADDコンテンツ展開State
  const [addOpen, setAddOpen] = useState(true);

  // 詳細表示対象タスクState
  const [showTaskDetail, setShowTaskDetail] = useState<TaskItem | any>(null);

  // 詳細表示対象タスク編集状態管理State
  const [showTaskDetailEditing, setShowTaskDetailEditing] =
    useState<boolean>(false);

  // 詳細表示展開State
  const [taskDetailOpen, setTaskDetailOpen] = useState<boolean>(true);

  const dispatch = useDispatch();

  // APIを経由してDBの情報を取得し、それぞれのStateに反映
  useEffect(() => {
    (async () => {
      // カテゴリの初期値
      const defaultCategory: Category = {
        userId: auth.currentUser!.uid,
        name: "None",
        orderIndex: 1,
      };
      // スケジュールの初期値
      const defaultSchedule: Schedule = {
        userId: auth.currentUser!.uid,
        name: "None",
        orderIndex: 1,
      };
      // カテゴリの初期値を設定
      await taskApi.categoryAdd(defaultCategory);
      // スケジュールの初期値を設定
      await taskApi.scheduleAdd(defaultSchedule);

      // APIから未完了タスク、完了タスク、カテゴリ、スケジュールを取得＆各Stateに反映
      dispatch(getAllInCompletedTaskItemsThunk(userId));
      dispatch(getAllCompletedTaskItemsThunk(userId));
      dispatch(getAllCategoriesThunk(userId));
      dispatch(getAllSchedulesThunk(userId));
    })();
  }, []);

  return (
    <>
      <showTaskDetailContext.Provider
        value={{ showTaskDetail, setShowTaskDetail }}
      >
        <main className=" mx-10 md:mx-20 my-4">
          <Account />
          <div className=" bg-gray-50 mx-auto my-4 p-4 border rounded-lg shadow">
            <div>
              <div className=" flex items-center gap-2 text-blue-500 text-2xl m-2 font-bold">
                <TbCategoryPlus size={35} />
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
            {addOpen ? <NewContents /> : ""}
          </div>
          <taskDetailOpenContext.Provider
            value={{ taskDetailOpen, setTaskDetailOpen }}
          >
            <showTaskDetailEditingContext.Provider
              value={{ showTaskDetailEditing, setShowTaskDetailEditing }}
            >
              <div className="xl:flex xl:gap-8">
                <TaskList />
                <TaskDetail />
              </div>
            </showTaskDetailEditingContext.Provider>
          </taskDetailOpenContext.Provider>
        </main>
      </showTaskDetailContext.Provider>
    </>
  );
}
