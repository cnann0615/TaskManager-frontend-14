import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

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
  // 現在のタブカテゴリとタブスケジュールを管理するStateを作成
  const [tabCategory, setTabCategory] = useState<number>(0);
  const [tabSchedule, setTabSchedule] = useState<number>(0);

  return (
    <tabCategoryContext.Provider value={{ tabCategory, setTabCategory }}>
      <tabScheduleContext.Provider value={{ tabSchedule, setTabSchedule }}>
        <CategoryTab />
        <ScheduleTab />
        <InCompletedTaskList />
        <CompletedTaskList />
      </tabScheduleContext.Provider>
    </tabCategoryContext.Provider>
  );
};

export default TaskList;
