import { useSelector } from "../../store/store";
import { tabCategoryContext } from "./TaskList";
import { useDispatch } from "react-redux";
import { Category } from "../../@types";
import { categoryUpdate } from "../../slices/categorySlice";
import taskApi from "../../api/task";
import { showTaskDetailContext } from "../../page";
import { inCompletedTaskUpdateCategory } from "../../slices/inCompletedTaskSlice";
import { completedTaskUpdateCategory } from "../../slices/completedTaskSlice";

import { useContext, useState } from "react";

// カテゴリのタブリスト
const CategoryTab: React.FC = () => {
  const dispatch = useDispatch();

  // カテゴリStateを取得
  const categories = useSelector((state) => state.categories);

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

  // 編集内容を確定し、Stateを更新（対象のカテゴリからカーソルが離れた時）
  const commitEdit = async () => {
    // カテゴリStateの更新
    const updateCategory = {
      id: editCategoryId!,
      name: editCategoryName!,
      orderIndex: editCategoryOrderIndex!,
    };
    dispatch(categoryUpdate(updateCategory));

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

    // APIを経由してデータベースに保存（更新）
    await taskApi.updateCategory(updateCategory);

    // 編集状態をクリア
    setEditCategoryId(null);
  };

  return (
    <div className=" ml-10 border-b border-gray-300">
      <button
        onClick={() => switchTab(0)}
        className={`bg-teal-100 hover:bg-teal-300 text-black py-2 px-4 rounded-t focus:outline-none focus:shadow-outline mr-[6.5px] ${
          tabCategory === 0 ? "font-bold bg-teal-300" : ""
        }`}
      >
        All
      </button>
      <div className="inline-block">
        {categories.categories.map((category, index) => (
          <div className="inline-block">
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
                  tabCategory === category.id ? "font-bold bg-teal-300" : ""
                }`}
              >
                {category.name}
                {/* タブの中の、カテゴリ名編集ボタン */}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // ボタン内のボタンのクリックイベントを阻止（カテゴリ名編集ボタンとタブのクリックを独立させる）
                    editCategory(category);
                  }}
                  className="text-xs my-0 ml-3 opacity-50 hover:opacity-100 cursor-pointer "
                >
                  ✏️
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTab;
