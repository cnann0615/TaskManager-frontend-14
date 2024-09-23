import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { BiDetail } from "react-icons/bi";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import {
  mustTaskContext,
  showTaskDetailContext,
  showTaskDetailEditingContext,
  taskDetailOpenContext,
} from "../../Main";
import {
  deleteCompletedTaskItemThunk,
  updateCompletedTaskItemThunk,
} from "../../slices/completedTaskSlice";
import {
  deleteInCompletedTaskItemThunk,
  updateInCompletedTaskItemThunk,
} from "../../slices/inCompletedTaskSlice";
import { useSelector } from "../../store/store";

// タスク詳細コンポーネント
const TaskDetail = React.memo(() => {
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
  // マストタスクStateを取得
  const { mustTask, setMustTask } = useContext(mustTaskContext);

  // カテゴリとスケジュールRedux Stateを取得
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
    try {
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
        // 更新内容を一時的に保存するオブジェクトに格納
        updatedDetail = { ...showTaskDetail, [field]: selectedCategory };
        // 編集対象がスケジュールの場合、選択されたスケジュールidに一致するスケジュールオブジェクトを取得
      } else if (field === "schedule") {
        const selectedSchedule = schedules.find(
          (schedule) => schedule.id == value
        );
        // 更新内容を一時的に保存するオブジェクトに格納
        updatedDetail = { ...showTaskDetail, [field]: selectedSchedule };
      } else {
        // 更新内容を一時的に保存するオブジェクト
        updatedDetail = { ...showTaskDetail, [field]: value };
      }
      // 詳細表示タスクStateの更新
      setShowTaskDetail(updatedDetail);
      // マストタスクStateの更新
      if (mustTask?.id === updatedDetail.id) {
        setMustTask(updatedDetail);
      }
      // 編集状態のトグル
      toggleEditOff(field);
      // DBと未完了or完了タスクRedux Stateに保存
      updatedDetail.isCompleted
        ? dispatch(updateCompletedTaskItemThunk(updatedDetail))
        : dispatch(updateInCompletedTaskItemThunk(updatedDetail));
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("タスクの更新中にエラーが発生しました。");
    }
  };

  // タスクの削除
  const deleteTask = async () => {
    try {
      const isConfirmed = window.confirm("本当にこのタスクを削除しますか？");
      // 上記ポップアップへのアクションがYesの場合
      if (isConfirmed) {
        // DBと、完了or未完了タスクRedux Stateから、対象のタスクを削除
        showTaskDetail!.isCompleted
          ? dispatch(deleteCompletedTaskItemThunk(showTaskDetail))
          : dispatch(deleteInCompletedTaskItemThunk(showTaskDetail));
        // 詳細表示タスクStateをnullにする
        setShowTaskDetail(null);
        // マストタスクStateをnullにする
        if (mustTask?.id === showTaskDetail.id) {
          setMustTask(null);
        }
      }
    } catch (error) {
      console.error("Error deleting task: ", error);
      alert("タスクの削除中にエラーが発生しました。");
    }
  };

  return (
    <>
      <div className=" bg-gray-50 border rounded-lg shadow overflow-hidden mx-auto mt-4 p-4 xl:w-[55%] ">
        <div>
          <div className=" text-blue-500 font-bold flex items-center text-2xl m-2">
            <div className=" flex items-center gap-2">
              <BiDetail size={35} />
              <h1 className=" mr-1 ">Task Detail</h1>
            </div>
            <button
              onClick={() => {
                setTaskDetailOpen(!taskDetailOpen);
              }}
              className=""
            >
              {taskDetailOpen ? (
                <MdOutlineExpandLess size={35} />
              ) : (
                <MdOutlineExpandMore size={35} />
              )}
            </button>
          </div>
        </div>
        {/* タスク詳細画面が開いている時だけ表示、詳細テーブルを表示。項目をクリックするとInputBoxになり、編集可能に。 */}
        {taskDetailOpen ? (
          <div className=" mt-6 ">
            <table className=" border leading-normal min-w-full">
              <tbody>
                {/* タイトル */}
                <tr className="h-20">
                  <th className=" bg-gray-100 border-b border-gray-200 text-sm font-bold block px-6 py-1 w-full text-left md:text-center md:table-cell  md:py-5 md:w-1/5 ">
                    Title
                  </th>
                  {showTaskDetail ? (
                    <td className=" border-b border-gray-200 bg-white text-sm block px-7 py-5 w-full md:w-4/5 md:table-cell ">
                      {editing.title ? (
                        <input
                          type="text"
                          defaultValue={showTaskDetail!.title}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            saveEdit("title", e.target.value)
                          }
                          autoFocus
                          className="bg-gray-50 rounded-md border-none focus:outline-none py-2"
                        />
                      ) : (
                        <div onClick={() => toggleEditOn("title")}>
                          {showTaskDetail!.title}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className=" border-b border-gray-200 bg-white text-sm block px-5 py-5 w-full md:w-4/5 md:table-cell">
                      <p>ー</p>
                    </td>
                  )}
                </tr>
                {/* 期日 */}
                <tr className="h-20">
                  <th className=" bg-gray-100 border-b border-gray-200 text-sm font-bold block px-6 py-1 w-full text-left md:text-center md:table-cell md:w-1/5 md:py-5">
                    Dead Line
                  </th>
                  {showTaskDetail ? (
                    <td className="border-b border-gray-200 bg-white text-sm block px-7 py-5 w-full md:w-4/5 md:table-cell">
                      {editing.deadLine ? (
                        <input
                          type="date"
                          defaultValue={showTaskDetail!.deadLine}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            saveEdit("deadLine", e.target.value)
                          }
                          autoFocus
                          className=" bg-gray-50 rounded-md border-gray-300 focus:outline-none py-2"
                        />
                      ) : (
                        <div onClick={() => toggleEditOn("deadLine")}>
                          {showTaskDetail!.deadLine
                            ? showTaskDetail!.deadLine
                            : "None"}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="border-b border-gray-200 bg-white text-sm block px-5 py-5 w-full md:w-4/5 md:table-cell">
                      <p>ー</p>
                    </td>
                  )}
                </tr>
                {/* カテゴリ */}
                <tr className="h-20">
                  <th className=" bg-gray-100 border-b border-gray-200 text-sm font-bold block px-6 py-1 w-full text-left md:text-center md:table-cell md:py-5 md:w-1/5 ">
                    Category
                  </th>
                  {showTaskDetail ? (
                    <td className=" border-b border-gray-200 bg-white text-sm block px-7 py-5 w-full md:w-4/5 md:table-cell">
                      {editing.category ? (
                        <select
                          defaultValue={showTaskDetail!.category.id}
                          onBlur={(
                            e: React.FocusEvent<HTMLSelectElement, Element>
                          ) => {
                            saveEdit("category", e.target.value);
                          }}
                          autoFocus
                          className=" bg-gray-50 rounded-md border-gray-300 focus:outline-none py-2"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div onClick={() => toggleEditOn("category")}>
                          {showTaskDetail!.category.name}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className=" border-b border-gray-200 bg-white text-sm block px-5 py-5 w-full md:w-4/5 md:table-cell">
                      <p>ー</p>
                    </td>
                  )}
                </tr>
                {/* スケジュール */}
                <tr className="h-20">
                  <th className=" bg-gray-100 border-b border-gray-200 text-sm font-bold block px-6 py-1 w-full text-left md:text-center md:table-cell md:py-5 md:w-1/5">
                    Schedule
                  </th>
                  {showTaskDetail ? (
                    <td className=" border-b border-gray-200 bg-white text-sm block px-7 py-5 w-full md:w-4/5 md:table-cell">
                      {editing.schedule ? (
                        <select
                          defaultValue={showTaskDetail!.schedule.id}
                          onBlur={(
                            e: React.FocusEvent<HTMLSelectElement, Element>
                          ) => {
                            saveEdit("schedule", e.target.value);
                          }}
                          autoFocus
                          className=" bg-gray-50 rounded-md border-gray-300 focus:outline-nonepy-2"
                        >
                          {schedules.map((schedule) => (
                            <option key={schedule.id} value={schedule.id}>
                              {schedule.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div onClick={() => toggleEditOn("schedule")}>
                          {showTaskDetail!.schedule.name}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="border-b border-gray-200 bg-white text-sm block px-5 py-5 w-full md:w-4/5 md:table-cell">
                      <p>ー</p>
                    </td>
                  )}
                </tr>
                {/* メモ */}
                <tr>
                  <th className=" bg-gray-100 border-b border-gray-200 text-sm font-bold block px-6 py-1 w-full text-left md:text-center md:table-cell md:py-5 md:w-1/5">
                    Memo
                  </th>
                  {showTaskDetail ? (
                    <td className="  border-b border-gray-200 bg-white text-sm block h-[380px] px-7 py-5w-full md:w-4/5 md:table-cell md:h-[450px]">
                      {editing.memo ? (
                        <textarea
                          defaultValue={showTaskDetail!.memo}
                          onBlur={(
                            e: React.FocusEvent<HTMLTextAreaElement, Element>
                          ) => saveEdit("memo", e.target.value)}
                          autoFocus
                          className="bg-gray-50 rounded-md border-gray-300 focus:outline-none p-2 w-full h-[340px] md:h-[400px] "
                        />
                      ) : (
                        // \nを改行タグ(<br />)に変換して表示
                        <div
                          onClick={() => toggleEditOn("memo")}
                          className="rounded-md border-gray-300 focus:outline-none bg-white p-2 w-full h-[340px] md:h-[400px] "
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
                    <td className=" border-b border-gray-200 bg-white text-sm block h-[380px] px-7 py-5 w-full md:w-4/5 md:table-cell md:h-[450px]">
                      <p>ー</p>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            {/* 詳細表示タスクがある時のみ、削除ボタンとマストタスクボタンを表示 */}
            {showTaskDetail ? (
              <div className=" flex justify-end">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded focus:outline-none focus:shadow-outline py-2 px-4"
                  onClick={() => setMustTask(showTaskDetail)}
                >
                  Must1！
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline py-2 px-4"
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
});

TaskDetail.displayName = "TaskDetail";
export default TaskDetail;
