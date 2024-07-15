import React, { useState, createContext } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { GoTasklist } from "react-icons/go";

import CompletedTaskList from "./CompletedTaskList";
import InCompletedTaskList from "./InCompletedTaskList";
import CategoryTab from "./CategoryTab";
import ScheduleTab from "./ScheduleTab";
import { TabCategory, TabSchedule } from "@/app/@types";

// タブカテゴリContextを作成
export const tabCategoryContext = createContext<TabCategory>({
  tabCategory: 0, //初期値は0（All）
  setTabCategory: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

// タブスケジュールContextを作成
export const tabScheduleContext = createContext<TabSchedule>({
  tabSchedule: 0, //初期値は0（All）
  setTabSchedule: () => {},
});

const TaskList: React.FC = () => {
  // タスクリスト画面展開State
  const [taskListOpen, setTaskListOpen] = useState(true);

  // 現在のタブカテゴリとタブスケジュールを管理するStateを作成
  const [tabCategory, setTabCategory] = useState<number>(0);
  const [tabSchedule, setTabSchedule] = useState<number>(0);

  return (
    <div className="bg-gray-50 mx-auto mt-4 p-4 border rounded-lg shadow xl:w-2/5">
      {/* タブカテゴリSteteとタブスケジュールStateは、TaskListコンポーネント全体で使用。（一番外側にラップ） */}
      <tabCategoryContext.Provider value={{ tabCategory, setTabCategory }}>
        <tabScheduleContext.Provider value={{ tabSchedule, setTabSchedule }}>
          <div>
            <div>
              <div className=" flex items-center text-blue-500 text-2xl m-2 font-bold">
                <div className=" flex items-center gap-2">
                  <GoTasklist size={35} />
                  <h1 className=" mr-1 ">Task List</h1>
                </div>
                {/* 画面横幅が1280以下の時だけ、タスクリスト画面を開閉可能にする。 */}
                {window.innerWidth <= 1280 ? (
                  // 開閉ボタン
                  <button
                    onClick={() => {
                      setTaskListOpen(!taskListOpen);
                    }}
                    className=""
                  >
                    {taskListOpen ? (
                      <MdOutlineExpandLess size={35} />
                    ) : (
                      <MdOutlineExpandMore size={35} />
                    )}
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* タスクリスト画面が開いている時だけ、タスクリスト＋タブを表示 */}
            {taskListOpen ? (
              <div className=" mt-6">
                {/* カテゴリのタブ */}
                <CategoryTab />
                <div className=" flex">
                  {/* スケジュールのタブ */}
                  <ScheduleTab />
                  <div className="px-5 py-2 w-[90%]">
                    {/* 未完了タスクリスト */}
                    <InCompletedTaskList />
                    {/* 完了タスクリスト */}
                    <CompletedTaskList />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </tabScheduleContext.Provider>
      </tabCategoryContext.Provider>
    </div>
  );
};

export default TaskList;
