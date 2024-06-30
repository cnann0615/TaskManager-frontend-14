"use client";
import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";

import TaskAdd from "./features/taskAdd/TaskAdd";
import CategoryAdd from "./features/categoryAdd/CategoryAdd";
import TaskList from "./features/taskList/TaskList";
import TaskDetail from "./features/taskDetails/TaskDetail";
import { Category, Schedule, TaskItem } from "./@types";
import taskApi from "./api/task";
import { inCompletedTaskAdd } from "./slices/inCompletedTaskSlice";
import { completedTaskAdd } from "./slices/completedTaskSlice";
import ScheduleAdd from "./features/scheduleAdd/ScheduleAdd";
import { categoryAdd } from "./slices/categorySlice";
import { scheduleAdd } from "./slices/scheduleSlice";
import CloseButtonY from "./components/CloseButtonY";
import OpenButtonY from "./components/OpenButtonY";

// 詳細表示対象Stateで使用する型を定義
type ShowTaskDetail = {
  showTaskDetail: TaskItem | any;
  setShowTaskDetail: Dispatch<SetStateAction<TaskItem | any>>;
};

// 詳細表示対象タスクStateを作成
export const showTaskDetailContext = createContext<ShowTaskDetail>({
  showTaskDetail: null,
  setShowTaskDetail: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

// 詳細表示対象タスク編集状態管理Stateで使用する型を定義
type ShowTaskDetailEditing = {
  showTaskDetailEditing: TaskItem | any;
  setShowTaskDetailEditing: Dispatch<SetStateAction<TaskItem | any>>;
};

// 詳細表示対象タスク編集状態管理Stateを作成
export const showTaskDetailEditingContext =
  createContext<ShowTaskDetailEditing>({
    showTaskDetailEditing: null,
    setShowTaskDetailEditing: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
  });

// 詳細表示展開Stateで使用する型を定義
type taskDetailOpen = {
  taskDetailOpen: boolean;
  setTaskDetailOpen: Dispatch<SetStateAction<boolean>>;
};

// 詳細表示展開Stateを作成
export const taskDetailOpenContext = createContext<taskDetailOpen>({
  taskDetailOpen: false,
  setTaskDetailOpen: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

export default function Home() {
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

  // APIを経由してデータベースの情報を取得し、それぞれのStateに反映
  useEffect(() => {
    (async () => {
      // 未完了タスク取得
      const inCompletedTaskItems: TaskItem[] =
        await taskApi.inCompletedTaskGet();
      // 完了タスク取得
      const completedTaskItems: TaskItem[] = await taskApi.completedTaskGet();
      // カテゴリ取得
      const categories: Category[] = await taskApi.categoryGetAll();
      // スケジュール取得
      const schedules: Schedule[] = await taskApi.scheduleGetAll();
      // 取得した未完了タスクを未完了タスクStateに反映
      inCompletedTaskItems.forEach((inCompletedTaskItem) =>
        dispatch(inCompletedTaskAdd(inCompletedTaskItem))
      );
      // 取得した完了タスクを完了タスクStateに反映
      completedTaskItems.forEach((completedTaskItem) =>
        dispatch(completedTaskAdd(completedTaskItem))
      );
      // 取得したカテゴリをカテゴリStateに反映
      categories.forEach((category) => dispatch(categoryAdd(category)));
      // 取得したスケジュールをスケジュールStateに反映
      schedules.forEach((schedule) => dispatch(scheduleAdd(schedule)));
    })();
  }, []);

  return (
    <>
      <showTaskDetailContext.Provider
        value={{ showTaskDetail, setShowTaskDetail }}
      >
        <main className=" mx-10 md:mx-20 my-8">
          <div className=" bg-gray-50 mx-auto my-4 p-4 border rounded-lg shadow">
            <div>
              <button
                onClick={() => {
                  setAddOpen(!addOpen);
                }}
                className="text-blue-500 text-xl m-2 font-bold"
              >
                <div className=" flex ">
                  <h1 className=" mr-1 ">New Contents</h1>
                  {addOpen ? <CloseButtonY /> : <OpenButtonY />}
                </div>
              </button>
            </div>
            {addOpen ? (
              <div className=" xl:flex xl:gap-x-7 p-4 ">
                <div className=" xl:w-2/4">
                  <TaskAdd />
                </div>
                <div className=" xl:w-1/4">
                  <CategoryAdd />
                </div>
                <div className=" xl:w-1/4">
                  <ScheduleAdd />
                </div>
              </div>
            ) : (
              ""
            )}
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
