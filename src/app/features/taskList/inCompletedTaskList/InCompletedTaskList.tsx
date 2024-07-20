import React from "react";
import { useContext } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "../../../store/store";
import { tabCategoryContext, tabScheduleContext } from "../TaskList";
import { TaskItem } from "../../../@types";
import { switchCompletedThunk } from "../../../slices/inCompletedTaskSlice";
import {
  showTaskDetailContext,
  showTaskDetailEditingContext,
  taskDetailOpenContext,
} from "../../../Main";

// 未完了タスクリスト
const InCompletedTaskList: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  // 未完了タスクRedux Stateを取得
  const inCompletedTaskItems = useSelector(
    (state) => state.inCompletedTaskItems
  );
  // タブカテゴリとタブスケジュール管理Stateの値を取得
  const { tabCategory } = useContext(tabCategoryContext);
  const { tabSchedule } = useContext(tabScheduleContext);

  // リストに表示するタスクをtabCategoryとtabScheduleの値で絞って抽出（パターン）

  // 全てのカテゴリのパターン
  const filteredInCompletedTaskItems =
    tabCategory === 0
      ? tabSchedule === 0
        ? // カテゴリもスケジュールも「全て」の場合
          inCompletedTaskItems
        : // スケジュールのみ指定がある場合
          inCompletedTaskItems.filter(
            (inCompletedTaskItem: TaskItem) =>
              inCompletedTaskItem.schedule.id == tabSchedule
          )
      : tabSchedule === 0
      ? // カテゴリのみ指定がある場合
        inCompletedTaskItems.filter(
          (inCompletedTaskItem: TaskItem) =>
            inCompletedTaskItem.category.id == tabCategory
        )
      : // カテゴリもスケジュールも指定がある場合
        inCompletedTaskItems.filter(
          (inCompletedTaskItem: TaskItem) =>
            inCompletedTaskItem.category.id == tabCategory &&
            inCompletedTaskItem.schedule.id == tabSchedule
        );

  // タスク詳細表示処理
  const { setShowTaskDetail } = useContext(showTaskDetailContext);
  // 詳細表示対象タスク編集状態管理State
  const { showTaskDetailEditing } = useContext(showTaskDetailEditingContext);
  // 詳細表示画面展開Stateを定義
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

  // タスクを完了に切り替える
  const handleSwitchCompleted = async (task: TaskItem) => {
    try {
      dispatch(switchCompletedThunk(task));
    } catch (error) {
      console.error("Error switching task to completed: ", error);
      alert("タスクの完了への切り替え中にエラーが発生しました。");
    }
  };

  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Incomplete Task</h2>
        <ul className="list-none w-full">
          {filteredInCompletedTaskItems.length == 0 ? (
            <div className="mt-5 mb-10 text-gray-500">No Task</div>
          ) : (
            ""
          )}
          {filteredInCompletedTaskItems.map((task: TaskItem, index: number) => (
            <li
              className="bg-white flex items-center justify-between mb-2 px-2 py-3 border"
              key={index}
            >
              <button
                onClick={() => handleSwitchCompleted(task)}
                className="text-xl text-blue-500 hover:text-blue-700 font-bold"
              >
                ◻︎
              </button>
              <span
                onClick={() => openTaskDetail(task)}
                className="cursor-pointer hover:bg-gray-100 flex-grow mx-2"
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
      <span id="dummy"></span>
    </>
  );
});

export default InCompletedTaskList;
