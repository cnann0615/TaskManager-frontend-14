import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import { useSelector } from "../../store/store";
import { tabCategoryContext } from "./TaskList";
import { useDispatch } from "react-redux";

import { Category } from "../../@types";
import {
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

// カテゴリのタブリスト
const CategoryTab: React.FC = () => {
  // サインイン情報取得
  const userId = auth.currentUser!.uid;
  // Reduxのdispatchを使用可能にする
  const dispatch = useDispatch();

  // 必要なStateを取得
  const categories = useSelector((state) => state.categories);
  const inCompletedTaskItems = useSelector(
    (state) => state.inCompletedTaskItems
  );
  const completedTaskItems = useSelector((state) => state.completedTaskItems);

  // タブカテゴリ管理State（どのタブが選択されているかを管理）
  const { tabCategory, setTabCategory } = useContext(tabCategoryContext);

  // タブクリック時にタブカテゴリ管理Stateにセットする
  const switchTab = (id: number) => {
    setTabCategory(id);
  };

  // カテゴリ名編集機能//////////////////

  // タブからカテゴリ名を変更した際に詳細表示中タスクのカテゴリ名も変更する必要があるため、詳細表示タスクStateの値と更新用関数を定義
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

      try {
        // DB,Redux Stateに反映
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

        // 変更されたカテゴリが割り当てられた未完了タスクRedux Stateを動的に更新
        dispatch(inCompletedTaskUpdateCategory(updateCategory));

        // 変更されたカテゴリが割り当てられた完了タスクRedux Stateを動的に更新
        dispatch(completedTaskUpdateCategory(updateCategory));
      } catch (error) {
        console.error("Error updating category: ", error);
        alert("カテゴリの更新中にエラーが発生しました。");
      }
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
      try {
        // 削除対象カテゴリに割り当てられているタスクを全て削除
        // 未完了タスクから対象抽出
        const deleteInCompletedTaskItems = inCompletedTaskItems.filter(
          (inCompletedTaskItem) =>
            inCompletedTaskItem.category.id === deleteCategory.id
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
            completedTaskItem.category.id === deleteCategory.id
        );
        // 完了タスク削除関数の定義
        const completedTaskPromises = deleteCompletedTaskItems.map(
          async (completedTaskItem) => {
            dispatch(completedTaskDelete(completedTaskItem));
            await taskApi.taskDelete(completedTaskItem);
          }
        );

        // 全てのタスク削除処理が完了するのを待つ（削除対象のカテゴリに紐づくタスクを先に消しておかないと、タスクのカテゴリ参照先がなくなりエラーとなるため。）
        await Promise.all([
          ...inCompletedTaskPromises,
          ...completedTaskPromises,
        ]);

        // 詳細表示タスクに割り当てられている場合、詳細表示タスクをnullにする。
        if (
          showTaskDetail &&
          showTaskDetail.category.id === deleteCategory.id
        ) {
          setShowTaskDetail(null);
        }

        // DB,Redux Stateから削除
        dispatch(deleteCategoryThunk(deleteCategory));
      } catch (error) {
        console.error("Error deleting category: ", error);
        alert("カテゴリの削除中にエラーが発生しました。");
      }
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
            {/* カテゴリ名編集中はinput BOXを表示。通常は、カテゴリ名と編集、削除ボタンを表示　*/}

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
