import axios from "axios";
import { TaskItem, Category, Schedule } from "../@types";

const ENDPOINT_URL = "http://localhost:8080/taskAPI";

const taskApi = {
  // 取得////////////////////////////////

  // タスク取得///////////////
  // 全タスク取得
  async taskGetAll(userId: string) {
    try {
      const result = await axios.get(`${ENDPOINT_URL}/task?userId=${userId}`);
      return result.data;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },
  // 未完了タスク取得
  async inCompletedTaskGet(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/inCompletedTask?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching incomplete tasks:", error);
      throw error;
    }
  },
  // 完了タスク取得
  async completedTaskGet(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/completedTask?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      throw error;
    }
  },
  // タスクをカテゴリIDから取得
  async taskGetByCategoryId(userId: string, categoryId: number) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/task/${categoryId}?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching tasks by category ID:", error);
      throw error;
    }
  },
  // タスクをスケジュールIDから取得
  async taskGetByScheduleId(userId: string, scheduleId: number) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/task/${scheduleId}?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching tasks by schedule ID:", error);
      throw error;
    }
  },
  // 最新のタスク取得
  async latestTaskGet(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/latestTask?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching latest task:", error);
      throw error;
    }
  },
  // 最大のorderIndex（タスク）を取得
  async maxTaskOrderIndexGet(userId: string) {
    try {
      let result = await axios.get(
        `${ENDPOINT_URL}/maxTaskOrderIndex?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching max task order index:", error);
      throw error;
    }
  },
  // カテゴリ取得///////////////
  // 全カテゴリ取得
  async categoryGetAll(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/category?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  },
  // 最新のカテゴリ取得
  async latestCategoryGet(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/latestCategory?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching latest category:", error);
      throw error;
    }
  },
  // カテゴリをidから取得
  async categoryGetById(id: number) {
    try {
      const result = await axios.get(`${ENDPOINT_URL}/category/${id}`);
      return result.data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw error;
    }
  },
  // 最大のorderIndex（カテゴリ）を取得
  async maxCategoryOrderIndexGet(userId: string) {
    try {
      let result = await axios.get(
        `${ENDPOINT_URL}/maxCategoryOrderIndex?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching max category order index:", error);
      throw error;
    }
  },

  // スケジュール取得///////////////
  // 全スケジュール取得
  async scheduleGetAll(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/schedule?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching all schedules:", error);
      throw error;
    }
  },
  // 最新のスケジュール取得
  async latestScheduleGet(userId: string) {
    try {
      const result = await axios.get(
        `${ENDPOINT_URL}/latestSchedule?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching latest schedule:", error);
      throw error;
    }
  },
  // スケジュールをidから取得
  async scheduleGetById(id: number) {
    try {
      const result = await axios.get(`${ENDPOINT_URL}/schedule/${id}`);
      return result.data;
    } catch (error) {
      console.error("Error fetching schedule by ID:", error);
      throw error;
    }
  },
  // 最大の orderIndex（スケジュール）を取得
  async maxScheduleOrderIndexGet(userId: string) {
    try {
      let result = await axios.get(
        `${ENDPOINT_URL}/maxScheduleOrderIndex?userId=${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching max schedule order index:", error);
      throw error;
    }
  },

  // 追加////////////////////////////////

  // タスク追加/////////////////
  // タスク（１件）追加
  async taskAdd(taskItem: TaskItem) {
    try {
      const result = await axios.post(ENDPOINT_URL + "/task", taskItem);
      return result.data;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  },

  // カテゴリ追加////////////////
  // カテゴリ（１件）追加　→　カテゴリ名が重複した場合は、nullを返す。
  async categoryAdd(category: Category) {
    try {
      const result = await axios.post(ENDPOINT_URL + "/category", category);
      return result.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  // スケジュール追加////////////////
  // スケジュール（１件）追加　→　スケジュール名が重複した場合は、nullを返す。
  async scheduleAdd(schedule: Schedule) {
    try {
      const result = await axios.post(ENDPOINT_URL + "/schedule", schedule);
      return result.data;
    } catch (error) {
      console.error("Error adding schedule:", error);
      throw error;
    }
  },

  // 削除////////////////////////////////

  // タスク削除////////////////
  // タスク（１件）削除
  async taskDelete(taskItem: TaskItem) {
    try {
      const result = await axios.delete(ENDPOINT_URL + "/task/" + taskItem.id);
      return result.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // カテゴリ削除//////////////
  // カテゴリ（１件）削除
  async categoryDelete(category: Category) {
    try {
      const result = await axios.delete(
        ENDPOINT_URL + "/category/" + category.id
      );
      return result.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  // スケジュール削除//////////////
  // スケジュール（１件）削除
  async scheduleDelete(schedule: Schedule) {
    try {
      const result = await axios.delete(
        ENDPOINT_URL + "/schedule/" + schedule.id
      );
      return result.data;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  },

  // 更新//////////////////////////////////

  // タスク更新////////////////
  // タスク（１件）更新
  async updateTask(taskItem: TaskItem) {
    try {
      await axios.put(ENDPOINT_URL + "/updateTask", taskItem);
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // カテゴリ更新//////////////
  // カテゴリ（１件）更新
  async updateCategory(category: Category) {
    try {
      await axios.put(ENDPOINT_URL + "/updateCategory", category);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // スケジュール更新//////////////
  // スケジュール（１件）更新
  async updateSchedule(schedule: Schedule) {
    try {
      await axios.put(ENDPOINT_URL + "/updateSchedule", schedule);
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  },
};

export default taskApi;
