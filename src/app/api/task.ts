// axiosを用いたAPI//////////////////////////////////////////////////////////////
import axios from "axios";

import { TaskItem, Category, Schedule } from "../@types";

const ENDPOINT_URL = "http://localhost:8080/taskAPI";

const taskApi = {
  // 取得////////////////////////////////

  // タスク取得///////////////
  // 全タスク取得
  async taskGetAll(userId: string) {
    const result = await axios.get(`${ENDPOINT_URL}/task?userId=${userId}`);
    return result.data;
  },
  // 未完了タスク取得
  async inCompletedTaskGet(userId: string) {
    const result = await axios.get(
      `${ENDPOINT_URL}/inCompletedTask?userId=${userId}`
    );
    return result.data;
  },
  // 完了タスク取得
  async completedTaskGet(userId: string) {
    const result = await axios.get(
      `${ENDPOINT_URL}/completedTask?userId=${userId}`
    );
    return result.data;
  },
  // タスクをカテゴリIDから取得
  async taskGetByCategoryId(userId: string, categoryId: number) {
    const result = await axios.get(
      `${ENDPOINT_URL}/task/${categoryId}?userId=${userId}`
    );
    return result.data;
  },
  // タスクをスケジュールIDから取得
  async taskGetByScheduleId(userId: string, scheduleId: number) {
    const result = await axios.get(
      `${ENDPOINT_URL}/task/${scheduleId}?userId=${userId}`
    );
    return result.data;
  },
  // 最新のタスク取得
  async latestTaskGet(userId: string) {
    const result = await axios.get(
      `${ENDPOINT_URL}/latestTask?userId=${userId}`
    );
    return result.data;
  },
  // 最大のorderIndex（タスク）を取得
  async maxTaskOrderIndexGet(userId: string) {
    let result = await axios.get(
      `${ENDPOINT_URL}/maxTaskOrderIndex?userId=${userId}`
    );
    return result.data;
  },
  // カテゴリ取得///////////////
  // 全カテゴリ取得
  async categoryGetAll(userId: string) {
    const result = await axios.get(`${ENDPOINT_URL}/category?userId=${userId}`);
    return result.data;
  },
  // 最新のカテゴリ取得
  async latestCategoryGet(userId: string) {
    const result = await axios.get(
      `${ENDPOINT_URL}/latestCategory?userId=${userId}`
    );
    return result.data;
  },
  // カテゴリをidから取得
  async categoryGetById(id: number) {
    const result = await axios.get(`${ENDPOINT_URL}/category/${id}`);
    return result.data;
  },
  // 最大のorderIndex（カテゴリ）を取得
  async maxCategoryOrderIndexGet(userId: string) {
    let result = await axios.get(
      `${ENDPOINT_URL}/maxCategoryOrderIndex?userId=${userId}`
    );
    return result.data;
  },

  // スケジュール取得///////////////
  // 全スケジュール取得
  async scheduleGetAll(userId: string) {
    const result = await axios.get(`${ENDPOINT_URL}/schedule?userId=${userId}`);
    return result.data;
  },
  // 最新のスケジュール取得
  async latestScheduleGet(userId: string) {
    const result = await axios.get(
      `${ENDPOINT_URL}/latestSchedule?userId=${userId}`
    );
    return result.data;
  },
  // スケジュールをidから取得
  async scheduleGetById(id: number) {
    const result = await axios.get(`${ENDPOINT_URL}/schedule/${id}`);
    return result.data;
  },
  // 最大のorderIndex（スケジュール）を取得
  async maxScheduleOrderIndexGet(userId: string) {
    let result = await axios.get(
      `${ENDPOINT_URL}/maxScheduleOrderIndex?userId=${userId}`
    );
    return result.data;
  },

  // 追加////////////////////////////////

  // タスク追加/////////////////
  // タスク（１件）追加
  async taskAdd(taskItem: TaskItem) {
    const result = await axios.post(ENDPOINT_URL + "/task", taskItem);
    return result.data;
  },

  // カテゴリ追加////////////////
  // カテゴリ（１件）追加　→　カテゴリ名が重複した場合は、nullを返す。
  async categoryAdd(category: Category) {
    const result = await axios.post(ENDPOINT_URL + "/category", category);
    return result.data;
  },

  // スケジュール追加////////////////
  // スケジュール（１件）追加　→　スケジュール名が重複した場合は、nullを返す。
  async scheduleAdd(schedule: Schedule) {
    const result = await axios.post(ENDPOINT_URL + "/schedule", schedule);
    return result.data;
  },

  // 削除////////////////////////////////

  // タスク削除////////////////
  // タスク（１件）削除
  async taskDelete(taskItem: TaskItem) {
    const result = await axios.delete(ENDPOINT_URL + "/task/" + taskItem.id);
    return result.data;
  },

  // カテゴリ削除//////////////
  // カテゴリ（１件）削除
  async categoryDelete(category: Category) {
    const result = await axios.delete(
      ENDPOINT_URL + "/category/" + category.id
    );
    return result.data;
  },

  // スケジュール削除//////////////
  // スケジュール（１件）削除
  async scheduleDelete(schedule: Schedule) {
    const result = await axios.delete(
      ENDPOINT_URL + "/schedule/" + schedule.id
    );
    return result.data;
  },

  // 更新//////////////////////////////////

  // タスク更新////////////////
  // タスク（１件）更新
  async updateTask(taskItem: TaskItem) {
    await axios.put(ENDPOINT_URL + "/updateTask", taskItem);
  },

  // カテゴリ更新//////////////
  // カテゴリ（１件）更新
  async updateCategory(category: Category) {
    await axios.put(ENDPOINT_URL + "/updateCategory", category);
  },

  // スケジュール更新//////////////
  // スケジュール（１件）更新
  async updateSchedule(schedule: Schedule) {
    await axios.put(ENDPOINT_URL + "/updateSchedule", schedule);
  },
};

export default taskApi;
