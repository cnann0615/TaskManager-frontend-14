import { useDispatch } from "react-redux";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

import { useSelector } from "../../store/store";
import { tabScheduleContext } from "./TaskList";
import { Schedule } from "../../@types";
import {
  deleteScheduleThunk,
  updateScheduleThunk,
} from "../../slices/scheduleSlice";
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

// スケジュールのタブリスト
const ScheduleTab: React.FC = () => {
  // サインイン情報取得
  const [user] = useAuthState(auth);
  const userId = auth.currentUser!.uid;

  // Reduxのdispatchを使用可能にする
  const dispatch = useDispatch();

  // 必要なRedux Stateを取得
  const schedules = useSelector((state) => state.schedules);
  const inCompletedTaskItems = useSelector(
    (state) => state.inCompletedTaskItems
  );
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

  // タブスケジュール管理State（どのタブが選択されているかを管理）
  const { tabSchedule, setTabSchedule } = useContext(tabScheduleContext);

  // タブクリック時にタブスケジュール管理Stateにセットする
  const switchTab = (id: number) => {
    setTabSchedule(id);
  };

  // スケジュール名編集機能//////////////////

  // タブからスケジュール名を変更した際に詳細表示中タスクのスケジュール名も変更する必要があるため、詳細表示タスクStateの値と更新用関数を定義
  const { showTaskDetail, setShowTaskDetail } = useContext(
    showTaskDetailContext
  );
  // 編集中のスケジュールIDとスケジュール名を保持するためのState
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);
  const [editScheduleOrderIndex, setEditScheduleOrderIndex] = useState<
    number | null
  >(null);
  const [editScheduleName, setEditScheduleName] = useState("");

  // スケジュール名変更ボタン押下時に、対象のスケジュールのIDと名前をStateにセット
  const editSchedule = (schedule: Schedule) => {
    setEditScheduleId(schedule.id!);
    setEditScheduleName(schedule.name);
    setEditScheduleOrderIndex(schedule.orderIndex);
  };

  // 編集内容を確定（対象のスケジュールからカーソルが離れた時）
  const commitEdit = async () => {
    if (editScheduleName) {
      // スケジュールStateの更新
      const updateSchedule = {
        id: editScheduleId!,
        userId: userId,
        name: editScheduleName!,
        orderIndex: editScheduleOrderIndex!,
      };

      // DB,Redux Stateに反映
      dispatch(updateScheduleThunk(updateSchedule));

      // 詳細表示されているタスクのスケジュールを動的に更新
      if (showTaskDetail) {
        let updateShowTaskDetail = { ...showTaskDetail };
        // 更新したスケジュールが詳細表示対象のタスクのスケジュールだった場合、スケジュール名を動的に更新する
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

      // 変更されたスケジュールが割り当てられた未完了タスクRedux Stateを動的に更新
      dispatch(inCompletedTaskUpdateSchedule(updateSchedule));

      // 変更されたスケジュールが割り当てられた完了タスクRedux Stateを動的に更新
      dispatch(completedTaskUpdateSchedule(updateSchedule));
    }

    // 編集状態をクリア
    setEditScheduleId(null);
  };

  // スケジュール削除
  const deleteSchedule = async (deleteSchedule: Schedule) => {
    // 確認ポップアップを表示
    const isConfirmed = window.confirm(
      "スケジュールに割り当てられたタスクも削除されます。本当に削除しますか？"
    );
    // 上記ポップアップへのアクションがYesの場合
    if (isConfirmed) {
      // 削除対象スケジュールに割り当てられているタスクを全て削除
      // 未完了タスクから対象抽出
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
      // 完了タスクから対象抽出
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
      // 全てのタスク削除処理が完了するのを待つ（削除対象のスケジュールに紐づくスケジュールを先に消しておかないと、タスクのスケジュール参照先がなくなりエラーとなるため。）
      await Promise.all([...inCompletedTaskPromises, ...completedTaskPromises]);

      // 詳細表示タスクに割り当てられている場合、詳細表示タスクをnullにする。
      if (showTaskDetail && showTaskDetail.schedule.id === deleteSchedule.id) {
        setShowTaskDetail(null);
      }

      // DB,Redux Stateから削除
      dispatch(deleteScheduleThunk(deleteSchedule));
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
          tabSchedule === 0
            ? "font-bold bg-purple-300 border-b-2 border-purple-500"
            : "border-b-2 border-purple-300"
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
          <div className="block" style={{ whiteSpace: "nowrap" }} key={index}>
        {/* スケジュール名編集中はinput BOXを表示。通常は、スケジュール名と編集、削除ボタンを表示　*/}
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
                    ? "font-bold bg-purple-300 border-b-2 border-purple-500 "
                    : " border-b-2 border-purple-300"
                }`}
                style={{
                  writingMode: "vertical-lr",
                  whiteSpace: "nowrap",
                }}
              >
                {schedule.name}
                {/* タブの中の、スケジュール名編集ボタン */}
                {schedule.orderIndex != 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（スケジュール名編集ボタンとタブのクリックを独立させる）
                      editSchedule(schedule);
                    }}
                    className="text-xs my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer mt-2"
                  >
                    ✏️
                  </span>
                )}
                {/* タブの中の、スケジュール削除ボタン */}
                {schedule.orderIndex != 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（カテゴリ名編集ボタンとタブのクリックを独立させる）
                      deleteSchedule(schedule);
                    }}
                    className=" text-[5px] my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer mt-2"
                  >
                    ❌
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTab;
