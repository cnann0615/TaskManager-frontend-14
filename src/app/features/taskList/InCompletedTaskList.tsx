import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../store/store";
import { tabCategoryContext, tabScheduleContext } from "./TaskList";
import { TaskItem } from "../../@types";
import { inCompletedTaskDelete } from "../../slices/inCompletedTaskSlice";
import { completedTaskAdd } from "../../slices/completedTaskSlice";
import {
  showTaskDetailContext,
  showTaskDetailEditingContext,
  taskDetailOpenContext,
} from "../../Main";
import taskApi from "../../api/task";

// 未完了タスクリスト
const InCompletedTaskList: React.FC = () => {
  const dispatch = useDispatch();

  // 未完了タスクStateを取得
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
            (inCompletedTaskItem) =>
              inCompletedTaskItem.schedule.id == tabSchedule
          )
      : tabSchedule === 0
      ? // カテゴリのみ指定がある場合
        inCompletedTaskItems.filter(
          (inCompletedTaskItem) =>
            inCompletedTaskItem.category.id == tabCategory
        )
      : // カテゴリもスケジュールも指定がある場合
        inCompletedTaskItems.filter(
          (inCompletedTaskItem) =>
            inCompletedTaskItem.category.id == tabCategory &&
            inCompletedTaskItem.schedule.id == tabSchedule
        );
  // タスク完了処理（buttonのonClick時に発火）
  const switchCompleted = async (updateTask: TaskItem) => {
    dispatch(inCompletedTaskDelete(updateTask));
    const _updateTask = { ...updateTask, completed: true };
    dispatch(completedTaskAdd(_updateTask));
    await taskApi.updateTask(_updateTask);
  };

  // タスク詳細表示処理
  const { setShowTaskDetail } = useContext(showTaskDetailContext);

  // 詳細表示対象タスク編集状態管理State
  const { showTaskDetailEditing } = useContext(showTaskDetailEditingContext);

  // 詳細表示展開Stateを定義
  const { setTaskDetailOpen } = useContext(taskDetailOpenContext);

  // タスククリック時に詳細を表示する。
  const openTaskDetail = (taskItem: TaskItem) => {
    showTaskDetailEditing || setShowTaskDetail(taskItem);
    setTaskDetailOpen(true);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
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
          {filteredInCompletedTaskItems.map((task, index) => (
            <li
              className="bg-white flex items-center justify-between mb-2 px-2 py-3 border"
              key={index}
            >
              <button
                onClick={() => switchCompleted(task)}
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
};

export default InCompletedTaskList;
