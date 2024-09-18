import React from "react";
import { useContext } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "../../../store/store";
import { tabCategoryContext, tabScheduleContext } from "../TaskList";
import { TaskItem } from "../../../@types";
import { switchInCompletedThunk } from "../../../slices/completedTaskSlice";
import {
  mustTaskContext,
  showTaskDetailContext,
  showTaskDetailEditingContext,
  taskDetailOpenContext,
} from "../../../Main";

// 完了タスクリスト
const CompletedTaskList: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  // 完了タスクRedux Stateを取得
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

  // タブカテゴリとタブスケジュール管理Stateの値を取得
  const { tabCategory } = useContext(tabCategoryContext);
  const { tabSchedule } = useContext(tabScheduleContext);
  // マストタスクStateを取得
  const { mustTask, setMustTask } = useContext(mustTaskContext);

  // リストに表示するタスクをtabCategoryとtabScheduleの値で絞って抽出（パターン）

  // 全てのカテゴリのパターン（０は全て）
  const filteredCompletedTaskItems =
    tabCategory === 0
      ? tabSchedule === 0
        ? // カテゴリもスケジュールも「全て」の場合
          completedTaskItems
        : // スケジュールのみ指定がある場合
          completedTaskItems.filter(
            (completedTaskItem: TaskItem) =>
              completedTaskItem.schedule.id == tabSchedule
          )
      : tabSchedule === 0
      ? // カテゴリのみ指定がある場合
        completedTaskItems.filter(
          (completedTaskItem: TaskItem) =>
            completedTaskItem.category.id == tabCategory
        )
      : // カテゴリもスケジュールも指定がある場合
        completedTaskItems.filter(
          (completedTaskItem: TaskItem) =>
            completedTaskItem.category.id == tabCategory &&
            completedTaskItem.schedule.id == tabSchedule
        );

  // タスク詳細表示処理
  const { setShowTaskDetail } = useContext(showTaskDetailContext);
  // 詳細表示対象タスク編集状態管理State
  const { showTaskDetailEditing } = useContext(showTaskDetailEditingContext);
  // 詳細表示展開Stateを定義
  const { setTaskDetailOpen } = useContext(taskDetailOpenContext);

  // タスククリック時に詳細を表示する。
  const openTaskDetail = (taskItem: TaskItem) => {
    // 他のタスクの編集中でない時に、クリックしたタスクを詳細表示タスクStateにsetする。
    showTaskDetailEditing || setShowTaskDetail(taskItem);
    // 詳細表示画面を展開する
    setTaskDetailOpen(true);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // タスクを未完了に切り替える
  const handleSwitchInCompleted = async (task: TaskItem) => {
    try {
      dispatch(switchInCompletedThunk(task));
      // マストタスクのカテゴリを動的に更新
      if (mustTask) {
        let updateMustTask = { ...mustTask };
        if (mustTask.id === task.id) {
          updateMustTask = {
            ...mustTask,
            isCompleted: false,
          };
        }
        setMustTask(updateMustTask);
      }
    } catch (error) {
      console.error("Error switching task to incomplete: ", error);
      alert("タスクの未完了への切り替え中にエラーが発生しました。");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-gray-500 mb-2">Completed</h2>
      <ul className="list-none w-full">
        {filteredCompletedTaskItems.length == 0 ? (
          <div className="mt-5 mb-10 text-gray-500">No Task</div>
        ) : (
          ""
        )}
        {filteredCompletedTaskItems.map((task: TaskItem, index: number) => (
          <li
            className="bg-white border flex items-center justify-between mb-2 px-2 py-3 "
            key={index}
          >
            <button
              onClick={() => handleSwitchInCompleted(task)}
              className=" text-xl text-blue-500 hover:text-blue-700"
            >
              ☑︎
            </button>
            <span
              onClick={() => openTaskDetail(task)}
              className="hover:bg-gray-100 line-through font-bold cursor-pointer flex-grow mx-2 "
            >
              {task.title}
            </span>
            <span className="text-left w-32">
              〆 {task.deadLine ? task.deadLine : "None"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

CompletedTaskList.displayName = "CompletedTaskList";
export default CompletedTaskList;
