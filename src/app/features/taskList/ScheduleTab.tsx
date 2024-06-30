import { useSelector } from "../../store/store";
import { tabScheduleContext } from "./TaskList";
import { useDispatch } from "react-redux";
import { Schedule } from "../../@types";
import { scheduleUpdate } from "../../slices/scheduleSlice";
import taskApi from "../../api/task";
import { showTaskDetailContext } from "../../page";
import { inCompletedTaskUpdateSchedule } from "../../slices/inCompletedTaskSlice";
import { completedTaskUpdateSchedule } from "../../slices/completedTaskSlice";

import { useContext, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// カテゴリのタブリスト
const ScheduleTab: React.FC = () => {
  const dispatch = useDispatch();

  // カテゴリStateを取得
  const schedules = useSelector((state) => state.schedules);

  // タブカテゴリ管理State（どのタブが選択されているかを管理）
  const { tabSchedule, setTabSchedule } = useContext(tabScheduleContext);

  // タブクリック時にタブカテゴリにセットする
  const switchTab = (id: number) => {
    setTabSchedule(id);
  };

  // カテゴリ名編集機能//////////////////

  // タブからカテゴリ名を変更した際に使用する、詳細表示タスクStateの値と更新用関数を定義
  const { showTaskDetail, setShowTaskDetail } = useContext(
    showTaskDetailContext
  );

  // 編集中のカテゴリIDとカテゴリ名を保持するためのState
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);
  const [editScheduleOrderIndex, setEditScheduleOrderIndex] = useState<
    number | null
  >(null);
  const [editScheduleName, setEditScheduleName] = useState("");

  // カテゴリ名変更ボタン押下時に、対象のカテゴリのIDと名前をStateにセット
  const editSchedule = (schedule: Schedule) => {
    setEditScheduleId(schedule.id!);
    setEditScheduleName(schedule.name);
    setEditScheduleOrderIndex(schedule.orderIndex);
  };

  // 編集内容を確定し、Stateを更新（対象のカテゴリからカーソルが離れた時）
  const commitEdit = async () => {
    // カテゴリStateの更新
    const updateSchedule = {
      id: editScheduleId!,
      name: editScheduleName!,
      orderIndex: editScheduleOrderIndex!,
    };
    dispatch(scheduleUpdate(updateSchedule));

    // 詳細表示されているタスクのカテゴリを動的に更新
    if (showTaskDetail) {
      let updateShowTaskDetail = { ...showTaskDetail };
      // 更新したカテゴリが詳細表示対象のタスクのカテゴリだった場合、カテゴリ名を動的に更新する
      if (showTaskDetail.schedule.id === updateSchedule.id) {
        updateShowTaskDetail = {
          ...showTaskDetail,
          schedule: {
            id: updateSchedule.id,
            name: updateSchedule.name,
            orderIndex: updateSchedule.orderIndex!,
          },
        };
      }
      setShowTaskDetail(updateShowTaskDetail);
    }

    // 未完了タスクStateのカテゴリを動的に更新
    dispatch(inCompletedTaskUpdateSchedule(updateSchedule));

    // 完了タスクStateのカテゴリを動的に更新
    dispatch(completedTaskUpdateSchedule(updateSchedule));

    // APIを経由してデータベースに保存（更新）
    await taskApi.updateSchedule(updateSchedule);

    // 編集状態をクリア
    setEditScheduleId(null);
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
    <div
      className="border-r border-gray-300"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <button
        onClick={() => switchTab(0)}
        className={`bg-purple-100 hover:bg-purple-300 text-black py-4 px-2 rounded-l focus:outline-none focus:shadow-outline mb-[6.5px] ${
          tabSchedule === 0 ? "font-bold bg-purple-300" : ""
        }`}
        style={{ writingMode: "vertical-lr", whiteSpace: "nowrap" }}
      >
        All
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="inline-block"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {schedules.schedules.map((schedule, index) => (
                <Draggable
                  key={schedule.id}
                  draggableId={schedule.id!.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="block"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {editScheduleId === schedule.id ? (
                        <input
                          type="text"
                          value={editScheduleName}
                          onChange={(e) => setEditScheduleName(e.target.value)}
                          onBlur={commitEdit}
                          autoFocus
                          className="py-4 px-2 rounded-l m-1"
                          style={{ writingMode: "vertical-lr" }}
                        />
                      ) : (
                        <button
                          onClick={() => switchTab(schedule.id!)}
                          className={` bg-purple-100 hover:bg-purple-300 text-black py-4 px-2 rounded-l focus:outline-none focus:shadow-outline ${
                            tabSchedule === schedule.id
                              ? "font-bold bg-purple-300"
                              : ""
                          }`}
                          style={{
                            writingMode: "vertical-lr",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {schedule.name}
                          {/* タブの中の、スケジュール名編集ボタン */}
                          <span
                            onClick={(e) => {
                              e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（スケジュール名編集ボタンとタブのクリックを独立させる）
                              editSchedule(schedule);
                            }}
                            className="text-xs my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer"
                          >
                            ✏️
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ScheduleTab;
