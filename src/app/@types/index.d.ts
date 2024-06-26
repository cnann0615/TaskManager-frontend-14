// カテゴリ型
export interface Category {
  id?: number;
  name: string;
  orderIndex: number;
}

// スケジュール型
export interface Schedule {
  id?: number;
  name: string;
  orderIndex: number;
}

// タスク型
export interface TaskItem {
  id?: number;
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
