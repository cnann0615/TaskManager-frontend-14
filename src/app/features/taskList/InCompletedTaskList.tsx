import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../store/store";
import { tabCategoryContext, tabScheduleContext } from "./TaskList";
import { TaskItem } from "../../@types";
import { inCompletedTaskDelete } from "../../slices/inCompletedTaskSlice";
import { completedTaskAdd } from "../../slices/completedTaskSlice";
import { showTaskDetailContext } from "../../page";
import taskApi from "../../api/task";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
          inCompletedTaskItems.inCompletedTaskItems
        : // スケジュールのみ指定がある場合
          inCompletedTaskItems.inCompletedTaskItems.filter(
            (inCompletedTaskItem) =>
              inCompletedTaskItem.schedule.id == tabSchedule
          )
      : tabSchedule === 0
      ? // カテゴリのみ指定がある場合
        inCompletedTaskItems.inCompletedTaskItems.filter(
          (inCompletedTaskItem) =>
            inCompletedTaskItem.category.id == tabCategory
        )
      : // カテゴリもスケジュールも指定がある場合
        inCompletedTaskItems.inCompletedTaskItems.filter(
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
  const openTaskDetail = (taskItem: TaskItem) => {
    setShowTaskDetail(taskItem);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // ドラッグ＆ドロップ処理
  const onDragEnd = (result: any) => {
    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) {
      return;
    } else if (startIndex < endIndex) {
    } else if (startIndex > endIndex) {
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">未完了タスク</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="inCompleteTasks">
          {(provided, snapshot) => (
            <ul
              className="list-none w-full"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredInCompletedTaskItems.length == 0 ? (
                <div className="mt-5 mb-10 text-gray-500">
                  未完了タスクはありません。
                </div>
              ) : (
                ""
              )}
              {filteredInCompletedTaskItems.map((task, index) => (
                <Draggable key={task.id} draggableId={task.title} index={index}>
                  {(provided, snapshot) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="bg-white flex items-center justify-between mb-2 p-2 border"
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
                      <span className="text-center w-32">
                        〆 {task.deadLine ? task.deadLine : "なし"}
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default InCompletedTaskList;
