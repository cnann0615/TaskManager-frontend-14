// カテゴリ型
export interface Category {
  id?: number;
  userId: string;
  name: string;
  orderIndex: number;
}

// スケジュール型
export interface Schedule {
  id?: number;
  userId: string;
  name: string;
  orderIndex: number;
}

// タスク型
export interface TaskItem {
  id?: number;
  userId: string;
  title: string;
  deadLine: string;
  category: Category;
  schedule: Schedule;
  memo: string;
  isCompleted: boolean;
  orderIndex: number;
}

// form入力時のタスク型
export interface inputTaskItem {
  title: "";
  deadLine: "";
  category: "";
  schedule: "";
  memo: "";
  isCompleted: false;
}

//contextで使用する型////////////////////////////////

// 詳細表示タスクContext
type ShowTaskDetail = {
  showTaskDetail: TaskItem | any;
  setShowTaskDetail: Dispatch<SetStateAction<TaskItem | any>>;
};

// 詳細表示タスク編集状態管理Context
type ShowTaskDetailEditing = {
  showTaskDetailEditing: TaskItem | any;
  setShowTaskDetailEditing: Dispatch<SetStateAction<TaskItem | any>>;
};

// 詳細表示画面展開Context
type taskDetailOpen = {
  taskDetailOpen: boolean;
  setTaskDetailOpen: Dispatch<SetStateAction<boolean>>;
};

// タブカテゴリContext
type TabCategory = {
  tabCategory: number;
  setTabCategory: Dispatch<SetStateAction<number>>;
};

// タブスケジュールContext
type TabSchedule = {
  tabSchedule: number;
  setTabSchedule: Dispatch<SetStateAction<number>>;
};
