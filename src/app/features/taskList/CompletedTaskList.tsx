import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../store/store";
import { tabCategoryContext, tabScheduleContext } from "./TaskList";
import { TaskItem } from "../../@types";
import { completedTaskDelete } from "../../slices/completedTaskSlice";
import { inCompletedTaskAdd } from "../../slices/inCompletedTaskSlice";
import { showTaskDetailContext, taskDetailOpenContext } from "../../page";
import taskApi from "../../api/task";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// 完了タスクリスト
const CompletedTaskList: React.FC = () => {
  const dispatch = useDispatch();

  // 完了タスクStateを取得
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

  // タブカテゴリとタブスケジュール管理Stateの値を取得
  const { tabCategory } = useContext(tabCategoryContext);
  const { tabSchedule } = useContext(tabScheduleContext);

  // リストに表示するタスクをtabCategoryとtabScheduleの値で絞って抽出（パターン）

  // 全てのカテゴリのパターン
  const filteredCompletedTaskItems =
    tabCategory === 0
      ? tabSchedule === 0
        ? // カテゴリもスケジュールも「全て」の場合
          completedTaskItems.completedTaskItems
        : // スケジュールのみ指定がある場合
          completedTaskItems.completedTaskItems.filter(
            (completedTaskItem) => completedTaskItem.schedule.id == tabSchedule
          )
      : tabSchedule === 0
      ? // カテゴリのみ指定がある場合
        completedTaskItems.completedTaskItems.filter(
          (completedTaskItem) => completedTaskItem.category.id == tabCategory
        )
      : // カテゴリもスケジュールも指定がある場合
        completedTaskItems.completedTaskItems.filter(
          (completedTaskItem) =>
            completedTaskItem.category.id == tabCategory &&
            completedTaskItem.schedule.id == tabSchedule
        );

  // タスク未完了処理
  const switchInCompleted = async (updateTask: TaskItem) => {
    dispatch(completedTaskDelete(updateTask));
    const _updateTask = { ...updateTask, completed: false };
    dispatch(inCompletedTaskAdd(_updateTask));
    await taskApi.updateTask(_updateTask);
  };

  // タスク詳細表示処理
  const { setShowTaskDetail } = useContext(showTaskDetailContext);
  // 詳細表示展開Stateを定義
  const { setTaskDetailOpen } = useContext(taskDetailOpenContext);
  const openTaskDetail = (taskItem: TaskItem) => {
    setShowTaskDetail(taskItem);
    setTaskDetailOpen(true);
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
      <h2 className="text-xl font-bold mb-2">Completed Task</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="completedTasks">
          {(provided) => (
            <ul
              className="list-none w-full"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredCompletedTaskItems.length == 0 ? (
                <div className="mt-5 mb-10 text-gray-500">No Task</div>
              ) : (
                ""
              )}
              {filteredCompletedTaskItems.map((task, index) => (
                <Draggable key={task.id} draggableId={task.title} index={index}>
                  {(provided, snapshot) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="bg-white flex items-center justify-between mb-2 px-2 py-3 border"
                    >
                      <button
                        onClick={() => switchInCompleted(task)}
                        className=" text-xl text-blue-500 hover:text-blue-700"
                      >
                        ☑︎
                      </button>
                      <span
                        onClick={() => openTaskDetail(task)}
                        className="cursor-pointer hover:bg-gray-100 flex-grow mx-2 line-through"
                      >
                        {task.title}
                      </span>
                      <span className="text-left w-32">
                        〆 {task.deadLine ? task.deadLine : "None"}
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

export default CompletedTaskList;
