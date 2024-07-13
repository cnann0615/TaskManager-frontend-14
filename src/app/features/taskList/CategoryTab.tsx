import { useSelector } from "../../store/store";
import { tabCategoryContext } from "./TaskList";
import { useDispatch } from "react-redux";
import { Category } from "../../@types";
import {
  categoryDelete,
  categoryUpdate,
  deleteCategoryThunk,
  updateCategoryThunk,
} from "../../slices/categorySlice";
import taskApi from "../../api/task";
import { showTaskDetailContext } from "../../Main";
import {
  inCompletedTaskDelete,
  inCompletedTaskUpdateCategory,
} from "../../slices/inCompletedTaskSlice";
import {
  completedTaskDelete,
  completedTaskUpdateCategory,
} from "../../slices/completedTaskSlice";

import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

// カテゴリのタブリスト
const CategoryTab: React.FC = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const userId = auth.currentUser!.uid;

  // 必要なStateを取得
  const categories = useSelector((state) => state.categories);
  const inCompletedTaskItems = useSelector(
    (state) => state.inCompletedTaskItems
  );
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

  // タブカテゴリ管理State（どのタブが選択されているかを管理）
  const { tabCategory, setTabCategory } = useContext(tabCategoryContext);

  // タブクリック時にタブカテゴリにセットする
  const switchTab = (id: number) => {
    setTabCategory(id);
  };

  // カテゴリ名編集機能//////////////////

  // タブからカテゴリ名を変更した際に使用する、詳細表示タスクStateの値と更新用関数を定義
  const { showTaskDetail, setShowTaskDetail } = useContext(
    showTaskDetailContext
  );

  // 編集中のカテゴリIDとカテゴリ名を保持するためのState
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryOrderIndex, setEditCategoryOrderIndex] = useState<
    number | null
  >(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // カテゴリ名変更ボタン押下時に、対象のカテゴリのIDと名前をStateにセット
  const editCategory = (category: Category) => {
    setEditCategoryId(category.id!);
    setEditCategoryName(category.name);
    setEditCategoryOrderIndex(category.orderIndex);
  };

  // 編集内容を確定（対象のカテゴリからカーソルが離れた時）
  const commitEdit = async () => {
    if (editCategoryName) {
      // カテゴリStateの更新
      const updateCategory = {
        id: editCategoryId!,
        userId: userId,
        name: editCategoryName!,
        orderIndex: editCategoryOrderIndex!,
      };

      // DB,Stateに反映
      dispatch(updateCategoryThunk(updateCategory));

      // 詳細表示されているタスクのカテゴリを動的に更新
      if (showTaskDetail) {
        let updateShowTaskDetail = { ...showTaskDetail };
        // 更新したカテゴリが詳細表示対象のタスクのカテゴリだった場合、カテゴリ名を動的に更新する
        if (showTaskDetail.category.id === updateCategory.id) {
          updateShowTaskDetail = {
            ...showTaskDetail,
            category: {
              id: updateCategory.id,
              name: updateCategory.name,
              orderIndex: updateCategory.orderIndex!,
            },
          };
        }
        setShowTaskDetail(updateShowTaskDetail);
      }

      // 未完了タスクStateのカテゴリを動的に更新
      dispatch(inCompletedTaskUpdateCategory(updateCategory));

      // 完了タスクStateのカテゴリを動的に更新
      dispatch(completedTaskUpdateCategory(updateCategory));
    }
    // 編集状態をクリア
    setEditCategoryId(null);
  };

  // カテゴリ削除
  const deleteCategory = async (deleteCategory: Category) => {
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
          inCompletedTaskItem.category.id === deleteCategory.id
      );
      const inCompletedTaskPromises = deleteInCompletedTaskItems.map(
        async (inCompletedTaskItem) => {
          dispatch(inCompletedTaskDelete(inCompletedTaskItem));
          await taskApi.taskDelete(inCompletedTaskItem);
        }
      );

      // 完了タスクから削除
      const deleteCompletedTaskItems = completedTaskItems.filter(
        (completedTaskItem) =>
          completedTaskItem.category.id === deleteCategory.id
      );
      const completedTaskPromises = deleteCompletedTaskItems.map(
        async (completedTaskItem) => {
          dispatch(completedTaskDelete(completedTaskItem));
          await taskApi.taskDelete(completedTaskItem);
        }
      );

      // 全てのタスク削除処理が完了するのを待つ（削除対象のカテゴリに紐づくタスクを先に消しておかないと、タスクのカテゴリ参照先がなくなりエラーとなるため。）
      await Promise.all([...inCompletedTaskPromises, ...completedTaskPromises]);

      // 詳細表示タスクに割り当てられている場合、詳細表示タスクをnullにする。
      if (showTaskDetail && showTaskDetail.category.id === deleteCategory.id) {
        setShowTaskDetail(null);
      }

      // DB,Stateから削除
      dispatch(deleteCategoryThunk(deleteCategory));
    }
  };
  return (
    <div className="ml-10 border-b border-gray-300">
      <button
        onClick={() => switchTab(0)}
        className={`bg-teal-100 hover:bg-teal-300 text-black py-2 px-4 rounded-t focus:outline-none focus:shadow-outline mr-[6.5px] ${
          tabCategory === 0
            ? "font-bold bg-teal-300 border-b-2 border-teal-500"
            : "border-b-2 border-teal-300"
        }`}
      >
        All
      </button>
      <div className="inline-block">
        {categories.map((category, index) => (
          <div className="inline-block" key={index}>
            {editCategoryId === category.id ? (
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                onBlur={commitEdit}
                autoFocus
                className="py-2 px-4 rounded-t m-1"
              />
            ) : (
              <button
                onClick={() => switchTab(category.id!)}
                className={`bg-teal-100 hover:bg-teal-300 text-black py-2 px-4 rounded-t focus:outline-none focus:shadow-outline mr-[6.5px] ${
                  tabCategory === category.id
                    ? "font-bold bg-teal-300 border-b-2 border-teal-500"
                    : "border-b-2 border-teal-300"
                }`}
              >
                {category.name}
                {/* タブの中の、カテゴリ名編集ボタン */}
                {category.orderIndex !== 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（カテゴリ名編集ボタンとタブのクリックを独立させる）
                      editCategory(category);
                    }}
                    className="text-xs my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer"
                  >
                    ✏️
                  </span>
                )}
                {/* タブの中の、カテゴリ削除ボタン */}
                {category.orderIndex !== 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（カテゴリ名編集ボタンとタブのクリックを独立させる）
                      deleteCategory(category);
                    }}
                    className="text-[5px] my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer"
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

export default CategoryTab;
