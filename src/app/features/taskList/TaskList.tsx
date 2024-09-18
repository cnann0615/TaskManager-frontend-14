import React, { useState, createContext } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { GoTasklist } from "react-icons/go";

import CompletedTaskList from "./completedTaskList/CompletedTaskList";
import InCompletedTaskList from "./inCompletedTaskList/InCompletedTaskList";
import CategoryTab from "./categoryTab/CategoryTab";
import ScheduleTab from "./scheduleTab/ScheduleTab";
import { TabCategory, TabSchedule } from "@/app/@types";
import MustOne from "./mustOne/MustOne";

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

const TaskList: React.FC = React.memo(() => {
  // タスクリスト画面展開State
  const [taskListOpen, setTaskListOpen] = useState(true);

  // 現在のタブカテゴリとタブスケジュールを管理するStateを作成
  const [tabCategory, setTabCategory] = useState<number>(0);
  const [tabSchedule, setTabSchedule] = useState<number>(0);

  return (
    <div className="bg-gray-50 rounded-lg border shadow mx-auto mt-4 p-4 xl:w-[45%]">
      <tabCategoryContext.Provider value={{ tabCategory, setTabCategory }}>
        <tabScheduleContext.Provider value={{ tabSchedule, setTabSchedule }}>
          <div>
            <div>
              <div className="text-blue-500 text-2xl font-bold flex items-center m-2">
                <div className=" flex items-center gap-2">
                  <GoTasklist size={35} />
                  <h1 className=" mr-1 ">Task List</h1>
                </div>
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
              </div>
            </div>
            {taskListOpen ? (
              <>
                <div>
                  <MustOne />
                </div>
                <div className=" mt-6">
                  <CategoryTab />
                  <div className=" flex">
                    <ScheduleTab />
                    <div className="px-5 py-2 w-[90%]">
                      <InCompletedTaskList />
                      <CompletedTaskList />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </tabScheduleContext.Provider>
      </tabCategoryContext.Provider>
    </div>
  );
});

TaskList.displayName = "TaskList";
export default TaskList;
