import { useSelector } from "../../store/store";
import { tabScheduleContext } from "./TaskList";
import { useDispatch } from "react-redux";
import { Schedule } from "../../@types";
import { scheduleDelete, scheduleUpdate } from "../../slices/scheduleSlice";
import taskApi from "../../api/task";
import { showTaskDetailContext } from "../../Main";
import {
  inCompletedTaskDelete,
  inCompletedTaskUpdateSchedule,
} from "../../slices/inCompletedTaskSlice";
import {
  completedTaskDelete,
  completedTaskUpdateSchedule,
} from "../../slices/completedTaskSlice";

import { useContext, useState } from "react";

// カテゴリのタブリスト
const ScheduleTab: React.FC = () => {
  const dispatch = useDispatch();

  // 必要なStateを取得
  const schedules = useSelector((state) => state.schedules);
  const inCompletedTaskItems = useSelector(
    (state) => state.inCompletedTaskItems
  );
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

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
    if (editScheduleName) {
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
    }

    // 編集状態をクリア
    setEditScheduleId(null);
  };

  // スケジュール削除
  const deleteSchedule = async (deleteSchedule: Schedule) => {
    // 確認ポップアップを表示
    const isConfirmed = window.confirm(
      "カテゴリに割り当てられたタスクも削除されます。本当に削除しますか？"
    );
    // 上記ポップアップへのアクションがYesの場合
    if (isConfirmed) {
      // 削除対象カテゴリに割り当てられているタスクを全て削除
      // 未完了タスクから削除
      const deleteInCompletedTaskItems = inCompletedTaskItems.filter(
        (inCompletedTaskItem) =>
          inCompletedTaskItem.schedule.id === deleteSchedule.id
      );
      // 未完了タスク削除関数の定義
      const inCompletedTaskPromises = deleteInCompletedTaskItems.map(
        async (inCompletedTaskItem) => {
          dispatch(inCompletedTaskDelete(inCompletedTaskItem));
          await taskApi.taskDelete(inCompletedTaskItem);
        }
      );

      // 完了タスクから削除
      const deleteCompletedTaskItems = completedTaskItems.filter(
        (completedTaskItem) =>
          completedTaskItem.schedule.id === deleteSchedule.id
      );
      // 完了タスク削除関数の定義
      const completedTaskPromises = deleteCompletedTaskItems.map(
        async (completedTaskItem) => {
          dispatch(completedTaskDelete(completedTaskItem));
          await taskApi.taskDelete(completedTaskItem);
        }
      );
      // 全てのタスク削除処理が完了するのを待つ（削除対象のカテゴリに紐づくスケジュールを先に消しておかないと、タスクのスケジュール参照先がなくなりエラーとなるため。）
      await Promise.all([...inCompletedTaskPromises, ...completedTaskPromises]);

      // 詳細表示タスクに割り当てられている場合、詳細表示タスクをnullにする。
      if (showTaskDetail && showTaskDetail.schedule.id === deleteSchedule.id) {
        setShowTaskDetail(null);
      }

      // カテゴリStateから削除
      dispatch(scheduleDelete(deleteSchedule));

      // APIを経由してデータベースから削除
      await taskApi.scheduleDelete(deleteSchedule);
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
      <div
        className="inline-block"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {schedules.map((schedule, index) => (
          <div className="block" style={{ whiteSpace: "nowrap" }}>
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
                  tabSchedule === schedule.id ? "font-bold bg-purple-300" : ""
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
                {/* タブの中の、スケジュール削除ボタン */}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（カテゴリ名編集ボタンとタブのクリックを独立させる）
                    deleteSchedule(schedule);
                  }}
                  className=" text-[5px] my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer "
                >
                  ❌
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTab;
