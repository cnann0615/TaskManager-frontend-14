import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";

import CloseButtonY from "@/app/components/button/CloseButtonY";
import OpenButtonY from "@/app/components/button/OpenButtonY";
import {
  showTaskDetailContext,
  showTaskDetailEditingContext,
  taskDetailOpenContext,
} from "../../Main";
import taskApi from "../../api/task";
import {
  completedTaskDelete,
  completedTaskUpdate,
} from "../../slices/completedTaskSlice";
import {
  inCompletedTaskDelete,
  inCompletedTaskUpdate,
} from "../../slices/inCompletedTaskSlice";
import { useSelector } from "../../store/store";

// タスク詳細コンポーネント
const TaskDetail = () => {
  const dispatch = useDispatch();

  // 詳細表示タスクStateを定義
  const { showTaskDetail, setShowTaskDetail } = useContext(
    showTaskDetailContext
  );

  // 詳細表示タスク編集状態管理Stateを定義
  const { setShowTaskDetailEditing } = useContext(showTaskDetailEditingContext);

  // 詳細表示展開Stateを定義
  const { taskDetailOpen, setTaskDetailOpen } = useContext(
    taskDetailOpenContext
  );

  // カテゴリとスケジュールStateを取得
  const categories = useSelector((state) => state.categories);
  const schedules = useSelector((state) => state.schedules);

  // 各項目の編集状態を管理するState
  const [editing, setEditing] = useState({
    title: false,
    deadLine: false,
    category: false,
    schedule: false,
    memo: false,
  });

  // 編集モードをオンにする関数
  const toggleEditOn = (field: string) => {
    setShowTaskDetailEditing(true);
    setEditing((prev) => ({ ...prev, [field]: true }));
  };
  // 編集モードをオフにする関数
  const toggleEditOff = (field: string) => {
    setShowTaskDetailEditing(false);
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  // 編集内容を保存し、編集モードを終了する関数
  const saveEdit = async (field: string, value: any) => {
    // 更新内容を一時的に保存するオブジェクト
    let updatedDetail = { ...showTaskDetail };

    // タイトルが空で送られてきた時は元のタイトルに戻して処理終了
    if (field === "title" && value === "") {
      toggleEditOff(field);
      return;
    }

    // 編集対象がカテゴリの場合、選択されたカテゴリidに一致するカテゴリオブジェクトを取得
    if (field === "category") {
      const selectedCategory = categories.find(
        (category) => category.id == value
      );
      // 更新内容を一時的に保存するオブジェクト
      updatedDetail = { ...showTaskDetail, [field]: selectedCategory };
      // 編集対象がスケジュールの場合、選択されたスケジュールidに一致するスケジュールオブジェクトを取得
    } else if (field === "schedule") {
      const selectedSchedule = schedules.find(
        (schedule) => schedule.id == value
      );
      // 更新内容を一時的に保存するオブジェクト
      updatedDetail = { ...showTaskDetail, [field]: selectedSchedule };
    } else {
      // 更新内容を一時的に保存するオブジェクト
      updatedDetail = { ...showTaskDetail, [field]: value };
    }

    // Contextの更新
    setShowTaskDetail(updatedDetail);
    // 編集状態のトグル
    toggleEditOff(field);
    // 未完了or完了タスクStateに保存
    dispatch(completedTaskUpdate(updatedDetail));
    dispatch(inCompletedTaskUpdate(updatedDetail));
    // APIを経由してデータベースに保存（更新）
    await taskApi.updateTask(updatedDetail);
  };

  // タスクの削除
  const deleteTask = async () => {
    // 確認ポップアップを表示
    const isConfirmed = window.confirm("本当にこのタスクを削除しますか？");
    // 上記ポップアップへのアクションがYesの場合
    if (isConfirmed) {
      // 完了フラグに応じて、完了タスクState or 未完了タスクStateから、対象のタスクを削除
      showTaskDetail!.isCompleted
        ? dispatch(completedTaskDelete(showTaskDetail))
        : dispatch(inCompletedTaskDelete(showTaskDetail));
      // APIを経由してデータベースから削除
      await taskApi.taskDelete(showTaskDetail!);
      setShowTaskDetail(null);
    }
  };

  return (
    <>
      <div className=" bg-gray-50 mx-auto mt-4 p-4 border shadow xl:w-3/5  overflow-hidden rounded-lg">
        <div>
          <button
            onClick={() => {
              setTaskDetailOpen(!taskDetailOpen);
            }}
            className="text-blue-500 text-xl m-2 font-bold"
          >
            <div className=" flex ">
              <h1 className=" mr-1 ">Task Detail</h1>
              {window.innerWidth <= 1280 ? (
                taskDetailOpen ? (
                  <CloseButtonY />
                ) : (
                  <OpenButtonY />
                )
              ) : (
                ""
              )}
            </div>
          </button>
        </div>
        {taskDetailOpen ? (
          <div className=" mt-3 ">
            <table className="min-w-full leading-normal border ">
              <thead>
                <tr>
                  <th className=" w-1/6 sm:w-1/5 px-7 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Column
                  </th>
                  <th className=" w-5/6 sm:w-4/5 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contents
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* タイトル */}
                <tr className="h-20">
                  <td className="px-7 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                    Title
                  </td>
                  {showTaskDetail ? (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {editing.title ? (
                        <input
                          type="text"
                          defaultValue={showTaskDetail!.title}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            saveEdit("title", e.target.value)
                          }
                          autoFocus
                          className="rounded-md border-none focus:outline-none bg-gray-50 py-2 pl-1"
                        />
                      ) : (
                        <div
                          onClick={() => toggleEditOn("title")}
                          className="pl-1"
                        >
                          {showTaskDetail!.title}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="pl-1">ー</p>
                    </td>
                  )}
                </tr>
                {/* 期日 */}
                <tr className="h-20">
                  <td className="px-7 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                    Dead Line
                  </td>
                  {showTaskDetail ? (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {editing.deadLine ? (
                        <input
                          type="date"
                          defaultValue={showTaskDetail!.deadLine}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            saveEdit("deadLine", e.target.value)
                          }
                          autoFocus
                          className="rounded-md border-gray-300 focus:outline-none bg-gray-50 py-2 pl-1"
                        />
                      ) : (
                        <div
                          onClick={() => toggleEditOn("deadLine")}
                          className="pl-1"
                        >
                          {showTaskDetail!.deadLine
                            ? showTaskDetail!.deadLine
                            : "None"}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="pl-1">ー</p>
                    </td>
                  )}
                </tr>
                {/* カテゴリ */}
                <tr className="h-20">
                  <td className="px-7 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                    Category
                  </td>
                  {showTaskDetail ? (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {editing.category ? (
                        <select
                          defaultValue={showTaskDetail!.category.id}
                          onBlur={(
                            e: React.FocusEvent<HTMLSelectElement, Element>
                          ) => {
                            saveEdit("category", e.target.value);
                          }}
                          autoFocus
                          className="rounded-md border-gray-300 focus:outline-none bg-gray-50 py-2"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          onClick={() => toggleEditOn("category")}
                          className="pl-1"
                        >
                          {showTaskDetail!.category.name}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="pl-1">ー</p>
                    </td>
                  )}
                </tr>
                {/* スケジュール */}
                <tr className="h-20">
                  <td className="px-7 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                    Schedule
                  </td>
                  {showTaskDetail ? (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {editing.schedule ? (
                        <select
                          defaultValue={showTaskDetail!.schedule.id}
                          onBlur={(
                            e: React.FocusEvent<HTMLSelectElement, Element>
                          ) => {
                            saveEdit("schedule", e.target.value);
                          }}
                          autoFocus
                          className="rounded-md border-gray-300 focus:outline-none bg-gray-50 py-2"
                        >
                          {schedules.map((schedule) => (
                            <option key={schedule.id} value={schedule.id}>
                              {schedule.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          onClick={() => toggleEditOn("schedule")}
                          className="pl-1"
                        >
                          {showTaskDetail!.schedule.name}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="pl-1">ー</p>
                    </td>
                  )}
                </tr>
                {/* メモ */}
                <tr>
                  <td className="px-7 py-5 border-b border-gray-200 bg-white text-sm h-96 font-bold">
                    Memo
                  </td>
                  {showTaskDetail ? (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm h-96">
                      {editing.memo ? (
                        <textarea
                          defaultValue={showTaskDetail!.memo}
                          onBlur={(
                            e: React.FocusEvent<HTMLTextAreaElement, Element>
                          ) => saveEdit("memo", e.target.value)}
                          autoFocus
                          className="w-full h-80 rounded-md border-gray-300 focus:outline-none bg-gray-50"
                        />
                      ) : (
                        // \nを改行タグ(<br />)に変換して表示
                        <div
                          onClick={() => toggleEditOn("memo")}
                          className="w-full h-80 rounded-md border-gray-300 focus:outline-none"
                        >
                          {showTaskDetail!.memo
                            .split("\n")
                            .map((line: any, index: number) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="pl-1">ー</p>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            {showTaskDetail ? (
              <div className=" flex justify-end">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={deleteTask}
                >
                  Delete
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default TaskDetail;
