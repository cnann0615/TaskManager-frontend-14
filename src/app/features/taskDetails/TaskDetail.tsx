import { showTaskDetailContext } from "../../page";
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

import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";

// タスク詳細コンポーネント
const TaskDetail = () => {
  const dispatch = useDispatch();

  // 詳細表示タスクStateを定義
  const { showTaskDetail, setShowTaskDetail } = useContext(
    showTaskDetailContext
  );

  // カテゴリStateを取得
  const categories = useSelector((state) => state.categories);

  // 各項目の編集状態を管理するState
  const [editing, setEditing] = useState({
    title: false,
    deadLine: false,
    category: false,
    memo: false,
  });

  // 編集モードをトグルする関数
  const toggleEdit = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [nameEmpty, setNameEmpty] = useState(false);

  // 編集内容を保存し、編集モードを終了する関数
  const saveEdit = async (field: string, value: any) => {
    // 更新内容を一時的に保存するオブジェクト
    let updatedDetail = { ...showTaskDetail };

    // 編集対象がカテゴリの場合、選択されたカテゴリidに一致するカテゴリオブジェクトを取得
    if (field === "category") {
      const selectedCategory = categories.categories.find(
        (category) => category.id == value
      );
      // 更新内容を一時的に保存するオブジェクト
      updatedDetail = { ...showTaskDetail, [field]: selectedCategory };
      // 編集状態のトグル
    } else {
      // 更新内容を一時的に保存するオブジェクト
      updatedDetail = { ...showTaskDetail, [field]: value };
    }
    // Contextの更新
    setShowTaskDetail(updatedDetail);
    // 編集状態のトグル
    toggleEdit(field);
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
      showTaskDetail.isCompleted
        ? dispatch(completedTaskDelete(showTaskDetail))
        : dispatch(inCompletedTaskDelete(showTaskDetail));
      // APIを経由してデータベースから削除
      await taskApi.taskDelete(showTaskDetail);
      setShowTaskDetail(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="w-1/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                項目
              </th>
              <th className="w-3/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                内容
              </th>
            </tr>
          </thead>
          <tbody>
            {/* タイトル */}
            <tr className="h-20">
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                タイトル
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {editing.title ? (
                  <input
                    type="text"
                    defaultValue={showTaskDetail.title}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      saveEdit("title", e.target.value)
                    }
                    autoFocus
                    className="rounded-md border-none focus:outline-none bg-gray-50 py-2 pl-1"
                  />
                ) : (
                  <div onClick={() => toggleEdit("title")} className="pl-1">
                    {showTaskDetail.title}
                  </div>
                )}
              </td>
            </tr>
            {/* 期日 */}
            <tr className="h-20">
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                期日
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {editing.deadLine ? (
                  <input
                    type="date"
                    defaultValue={showTaskDetail.deadLine}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      saveEdit("deadLine", e.target.value)
                    }
                    autoFocus
                    className="rounded-md border-gray-300 focus:outline-none bg-gray-50 py-2 pl-1"
                  />
                ) : (
                  <div onClick={() => toggleEdit("deadLine")} className="pl-1">
                    {showTaskDetail.deadLine ? showTaskDetail.deadLine : "なし"}
                  </div>
                )}
              </td>
            </tr>
            {/* カテゴリ */}
            <tr className="h-20">
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                カテゴリ
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {editing.category ? (
                  <select
                    defaultValue={showTaskDetail.category.id}
                    onBlur={(
                      e: React.FocusEvent<HTMLSelectElement, Element>
                    ) => {
                      saveEdit("category", e.target.value);
                    }}
                    autoFocus
                    className="rounded-md border-gray-300 focus:outline-none bg-gray-50 py-2"
                  >
                    {categories.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div onClick={() => toggleEdit("category")} className="pl-1">
                    {showTaskDetail.category.name}
                  </div>
                )}
              </td>
            </tr>
            {/* メモ */}
            <tr>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm h-96">
                メモ
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm h-96">
                {editing.memo ? (
                  <textarea
                    defaultValue={showTaskDetail.memo}
                    onBlur={(
                      e: React.FocusEvent<HTMLTextAreaElement, Element>
                    ) => saveEdit("memo", e.target.value)}
                    autoFocus
                    className="w-full h-80 rounded-md border-gray-300 focus:outline-none bg-gray-50"
                  />
                ) : (
                  // \nを改行タグ(<br />)に変換して表示
                  <div
                    onClick={() => toggleEdit("memo")}
                    className="w-full h-80 rounded-md border-gray-300 focus:outline-none"
                  >
                    {showTaskDetail.memo.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={deleteTask}
      >
        削除
      </button>
    </>
  );
};

export default TaskDetail;
