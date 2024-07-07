import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { GoTasklist } from "react-icons/go";

import CompletedTaskList from "./CompletedTaskList";
import InCompletedTaskList from "./InCompletedTaskList";
import CategoryTab from "./CategoryTab";
import ScheduleTab from "./ScheduleTab";

// tabCategoryとtabScheduleの状態とその更新関数の型を定義
type TabCategory = {
  tabCategory: number;
  setTabCategory: Dispatch<SetStateAction<number>>;
};
type TabSchedule = {
  tabSchedule: number;
  setTabSchedule: Dispatch<SetStateAction<number>>;
};

// 現在のタブカテゴリとスケジュールカテゴリをコンポーネントを跨いで管理するためにcreateContextを使用
export const tabCategoryContext = createContext<TabCategory>({
  tabCategory: 0,
  setTabCategory: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});
export const tabScheduleContext = createContext<TabSchedule>({
  tabSchedule: 0,
  setTabSchedule: () => {},
});

const TaskList: React.FC = () => {
  // タスクリスト展開State
  const [taskListOpen, setTaskListOpen] = useState(true);

  // 現在のタブカテゴリとタブスケジュールを管理するStateを作成
  const [tabCategory, setTabCategory] = useState<number>(0);
  const [tabSchedule, setTabSchedule] = useState<number>(0);

  return (
    <div className="bg-gray-50 mx-auto mt-4 p-4 border rounded-lg shadow xl:w-2/5">
      <tabCategoryContext.Provider value={{ tabCategory, setTabCategory }}>
        <tabScheduleContext.Provider value={{ tabSchedule, setTabSchedule }}>
          <div>
            <div>
              <div className=" flex items-center text-blue-500 text-2xl m-2 font-bold">
                <div className=" flex items-center gap-2">
                  <GoTasklist size={35} />
                  <h1 className=" mr-1 ">Task List</h1>
                </div>
                {window.innerWidth <= 1280 ? (
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
            {taskListOpen ? (
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
