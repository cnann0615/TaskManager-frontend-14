import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import CompletedTaskList from "./CompletedTaskList";
import InCompletedTaskList from "./InCompletedTaskList";
import ListTab from "./ListTab";

// tabCategoryの状態とその更新関数の型を定義
type TabCategory = {
  tabCategory: number;
  setTabCategory: Dispatch<SetStateAction<number>>;
};

// 現在のタブカテゴリをコンポーネントを跨いで管理するためにcreateContextを使用
export const tabCategoryContext = createContext<TabCategory>({
  tabCategory: 0,
  setTabCategory: () => {}, // この関数はダミー。実際にはuseStateによって提供される関数に置き換わる。
});

const TaskList: React.FC = () => {
  // 現在のタブカテゴリを管理するStateを作成
  const [tabCategory, setTabCategory] = useState<number>(0);

  return (
    <tabCategoryContext.Provider value={{ tabCategory, setTabCategory }}>
      <ListTab />
      <InCompletedTaskList />
      <CompletedTaskList />
    </tabCategoryContext.Provider>
  );
};

export default TaskList;
