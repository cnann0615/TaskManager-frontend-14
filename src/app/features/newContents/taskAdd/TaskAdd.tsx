import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { auth } from "@/app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdOutlineAddTask,
} from "react-icons/md";

import { addInCompletedTaskItemThunk } from "../../../slices/inCompletedTaskSlice";
import taskApi from "../../../api/task";
import { useSelector } from "../../../store/store";
import { Category, Schedule, TaskItem, inputTaskItem } from "../../../@types";
import AddButton from "@/app/components/button/AddButton";

// 新規タスク追加画面
const TaskAdd: React.FC = () => {
  // サインイン情報取得
  const userId = auth.currentUser!.uid;
  // Reduxのdispatchを使用可能にする
  const dispatch = useDispatch();

  // フォーム展開State
  const [formOpen, setFormOpen] = useState(false);

  // カテゴリRedux Stateを取得
  const categories = useSelector((state) => state.categories);
  // スケジュールRedux Stateを取得
  const schedules = useSelector((state) => state.schedules);

  // useFormを利用したフォームの処理
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<inputTaskItem>({ mode: "onSubmit" });

  const onSubmit = async (taskItem: inputTaskItem) => {
    try {
      // フォーム入力値のcategoryのidをもとに、APIでカテゴリを取得（フォーム詳細が閉じられたままタイトルのみで送られてきた場合は、デフォルトカテゴリを登録）
      const category: Category = formOpen
        ? await taskApi.categoryGetById(Number(taskItem.category))
        : { id: 1, userId: userId, name: "None", orderIndex: 1 };
      // フォーム入力値のscheduleのidをもとに、APIでスケジュールを取得（フォーム詳細が閉じられたままタイトルのみで送られてきた場合は、デフォルトスケジュールで登録）
      const schedule: Schedule = formOpen
        ? await taskApi.scheduleGetById(Number(taskItem.schedule))
        : { id: 1, userId: userId, name: "None", orderIndex: 1 };

      // APIから新規タスク用のorderIndexを取得（並び替えに使用）
      let orderIndex = await taskApi.maxTaskOrderIndexGet(userId);
      if (orderIndex) {
        orderIndex += 1;
      } else {
        orderIndex = 1;
      }
      // 新しいタスクオブジェクトを作成
      const newTask: TaskItem = formOpen
        ? {
            userId: userId,
            title: taskItem.title,
            deadLine: taskItem.deadLine,
            category: category,
            schedule: schedule,
            memo: taskItem.memo,
            isCompleted: false,
            orderIndex: orderIndex,
          }
        : // フォーム詳細が閉じられたままタイトルのみで送られてきた場合
          {
            userId: userId,
            title: taskItem.title,
            deadLine: "",
            category: category,
            schedule: schedule,
            memo: "",
            isCompleted: false,
            orderIndex: orderIndex,
          };
      // 新規タスクをDB, 未完了タスクRedux Stateに登録
      dispatch(addInCompletedTaskItemThunk({ userId, newTask }));
      // formをリセット
      reset();
    } catch (error) {
      console.error("Error adding new task: ", error);
      alert("新規タスクの追加中にエラーが発生しました。");
    }
  };

  return (
    <div>
      <div className=" flex items-center gap-2">
        <MdOutlineAddTask size={25} />
        <h3 className="font-bold">New Task</h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-white mx-auto mt-4 mb-10 p-4 border rounded-lg shadow"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <div className=" flex justify-between">
              <p>Title</p>
              <p className=" text-red-500 text-xs ">
                {errors.title?.message as React.ReactNode}
              </p>
            </div>
            <input
              type="text"
              {...register("title", { required: "Title is required." })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        {/* フォーム展開Stateがtrueの時のみTitle以外のフォームを表示 */}
        {formOpen ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Dead Line
                <input
                  type="date"
                  {...register("deadLine")}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
                <select
                  {...register("category")}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {/* useEffect内で取得したカテゴリを表示 */}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Schedule
                <select
                  {...register("schedule")}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {/* useEffect内で取得したスケジュールを表示 */}
                  {schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Memo
                <textarea
                  {...register("memo")}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className=" flex justify-between mx-auto">
          {/* フォーム展開ボタン */}
          <div>
            <button
              onClick={(e) => {
                setFormOpen(!formOpen);
                e.preventDefault();
              }}
              className="text-blue-500"
            >
              <div className=" flex items-center ">
                <p className=" ml-1 ">Detail</p>
                {formOpen ? (
                  <MdOutlineExpandLess size={30} />
                ) : (
                  <MdOutlineExpandMore size={30} />
                )}
              </div>
            </button>
          </div>
          <div>
            <AddButton />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskAdd;
