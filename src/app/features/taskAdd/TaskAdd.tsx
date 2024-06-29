import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { inCompletedTaskAdd } from "../../slices/inCompletedTaskSlice";
import { scheduleAdd } from "../../slices/scheduleSlice";
import { categoryAdd } from "../../slices/categorySlice";
import taskApi from "../../api/task";
import { useSelector } from "../../store/store";
import { Category, Schedule, TaskItem, inputTaskItem } from "../../@types";

// 新規タスク追加画面
const TaskAdd: React.FC = () => {
  const dispatch = useDispatch();

  // カテゴリStateが最新化（データベース→Redux）された状態でformを表示するための状態管理。
  const [isLoading, setIsLoading] = useState(true);

  // APIを経由してデータベースからカテゴリ、スケジュールを取得し、それぞれのStateに反映
  //isLoadingを使用したい都合上、page.tsx内側のuseEffectにまとめられていない。
  useEffect(() => {
    (async () => {
      const categories: Category[] = await taskApi.categoryGetAll();
      const schedules: Schedule[] = await taskApi.scheduleGetAll();
      categories.forEach((category) => dispatch(categoryAdd(category)));
      schedules.forEach((schedule) => dispatch(scheduleAdd(schedule)));
      setIsLoading(false);
    })();
  }, []);

  // カテゴリStateを取得
  const categories = useSelector((state) => state.categories);
  // スケジュールStateを取得
  const schedules = useSelector((state) => state.schedules);

  // useFormを利用したフォームの処理
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<inputTaskItem>({ mode: "onSubmit" });

  const onSubmit = async (taskItem: inputTaskItem) => {
    // フォーム入力値のcategoryのidをもとに、APIでカテゴリを取得
    const category: Category = await taskApi.categoryGetById(
      Number(taskItem.category)
    );
    // フォーム入力値のscheduleのidをもとに、APIでスケジュールを取得
    const schedule: Schedule = await taskApi.scheduleGetById(
      Number(taskItem.schedule)
    );
    // APIから新規タスク用のorderIndexを取得（並び替えに使用）
    let orderIndex = await taskApi.maxTaskOrderIndexGet();
    if (orderIndex) {
      orderIndex += 1;
    } else {
      orderIndex = 1;
    }
    // 新しいタスクオブジェクトを作成
    const newTask: TaskItem = {
      title: taskItem.title,
      deadLine: taskItem.deadLine,
      category: category,
      schedule: schedule,
      memo: taskItem.memo,
      isCompleted: false,
      orderIndex: orderIndex,
    };
    // 新しいタスクをAPI経由でデータベースに追加
    await taskApi.taskAdd(newTask);
    // IDが設定された新しいタスクを再度APIを経由してデータベースから取得
    const _newTask: TaskItem = await taskApi.latestTaskGet();
    // 新しいタスクを未完了タスクのStateに追加
    dispatch(inCompletedTaskAdd(_newTask));
    reset();
  };

  if (!isLoading) {
    return (
      <div>
        <h3 className="font-bold">タスク作成</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-4 mb-10 p-4 border rounded-lg shadow"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              タイトル：
              <input
                type="text"
                {...register("title", { required: "タイトルは必須です。" })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-red-500 text-xs italic">
                {errors.title?.message as React.ReactNode}
              </p>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              期日：
              <input
                type="date"
                {...register("deadLine")}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              カテゴリ：
              <select
                {...register("category")}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                {/* useEffect内で取得したカテゴリを表示 */}
                {categories.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              スケジュール：
              <select
                {...register("schedule")}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                {/* useEffect内で取得したカテゴリを表示 */}
                {schedules.schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              メモ：
              <textarea
                {...register("memo")}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default TaskAdd;
