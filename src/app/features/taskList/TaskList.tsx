import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import CompletedTaskList from "./CompletedTaskList";
import InCompletedTaskList from "./InCompletedTaskList";
import CategoryTab from "./CategoryTab";
import ScheduleTab from "./ScheduleTab";
import OpenButtonY from "@/app/components/button/OpenButtonY";
import CloseButtonY from "@/app/components/button/CloseButtonY";
import CloseButtonX from "@/app/components/button/CloseButtonX";
import OpenButtonX from "@/app/components/OpenButtonX";

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
              <button
                onClick={() => {
                  setTaskListOpen(!taskListOpen);
                }}
                className="text-blue-500 text-xl m-2 font-bold"
              >
                <div className=" flex ">
                  <h1 className=" mr-1 ">Task List</h1>
                  {window.innerWidth <= 1280 ? (
                    taskListOpen ? (
                      <CloseButtonY />
                    ) : (
                      <OpenButtonY />
                    )
                  ) : (
                    ""
                  )}
                </div>
              </button>
            </div>
            {taskListOpen ? (
              <div className=" mt-3">
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
