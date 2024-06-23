// axiosを用いたAPI//////////////////////////////////////////////////////////////
import axios from "axios";

import { TaskItem, Category } from "../@types";

const ENDPOINT_URL = "http://localhost:8080/taskAPI";

const taskApi = {
  // 取得////////////////////////////////

  // タスク取得///////////////
  // 全タスク取得
  async taskGetAll() {
    const result = await axios.get(ENDPOINT_URL + "/task");
    return result.data;
  },
  // 未完了タスク取得
  async inCompletedTaskGet() {
    const result = await axios.get(ENDPOINT_URL + "/inCompletedTask");
    return result.data;
  },
  // 完了タスク取得
  async completedTaskGet() {
    const result = await axios.get(ENDPOINT_URL + "/completedTask");
    return result.data;
  },
  // タスクをカテゴリIDから取得
  async taskGetByCategoryId(categoryId: number) {
    const result = await axios.get(ENDPOINT_URL + "/task/" + categoryId);
    return result.data;
  },
  // 最新のタスク取得
  async latestTaskGet() {
    const result = await axios.get(ENDPOINT_URL + "/latestTask");
    return result.data;
  },
  // 最大のorderIndex（タスク）を取得
  async maxTaskOrderIndexGet() {
    let result = await axios.get(ENDPOINT_URL + "/maxTaskOrderIndex");
    return result.data;
  },
  // カテゴリ取得///////////////
  // 全カテゴリ取得
  async categoryGetAll() {
    const result = await axios.get(ENDPOINT_URL + "/category");
    return result.data;
  },
  // 最新のカテゴリ取得
  async latestCategoryGet() {
    const result = await axios.get(ENDPOINT_URL + "/latestCategory");
    return result.data;
  },
  // カテゴリをidから取得
  async categoryGetById(id: number) {
    const result = await axios.get(ENDPOINT_URL + "/category/" + id);
    return result.data;
  },
  // 最大のorderIndex（カテゴリ）を取得
  async maxCategoryOrderIndexGet() {
    let result = await axios.get(ENDPOINT_URL + "/maxCategoryOrderIndex");
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
    console.log(category.id);
    const result = await axios.delete(
      ENDPOINT_URL + "/category/" + category.id
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
};

export default taskApi;
