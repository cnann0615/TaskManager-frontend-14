import { Category } from "../../@types";
import taskApi from "../../api/task";
import { categoryAdd } from "../../slices/categorySlice";
import { useForm } from "react-hook-form";

import { useDispatch } from "react-redux";

// 新規カテゴリ追加画面
const CategoryAdd: React.FC = () => {
  const dispatch = useDispatch();

  // useFormを使用したフォームの処理///////////
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (category: Category) => {
    // APIから新規タスク用のorderIndexを取得
    let orderIndex = await taskApi.maxCategoryOrderIndexGet();
    if (orderIndex) {
      orderIndex += 1;
    } else {
      orderIndex = 1;
    }
    // 新しいカテゴリオブジェクトを作成
    const newCategory: Category = {
      name: category.name,
      orderIndex: orderIndex,
    };
    // 新しいカテゴリをAPI経由でデータベースに追加し、結果を取得（カテゴリ名が既存のカテゴリと重複した場合、nullが返させる。）
    const categoryAddSuccess: Category = await taskApi.categoryAdd(newCategory);
    // カテゴリ名が重複せず追加された場合のみ処理を行う。（重複した場合、nullが返されるため以下の処理は行われない。）
    categoryAddSuccess &&
      (async () => {
        // IDが設定された新しいカテゴリを再度APIを経由してデータベースから取得
        const _newCategory: Category = await taskApi.latestCategoryGet();
        // 新しいカテゴリをカテゴリのStateに追加
        dispatch(categoryAdd(_newCategory));
      })();
    reset();
  };

  return (
    <div>
      <h3 className="font-bold">カテゴリ追加</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-4 mb-10 p-4 border rounded-lg shadow"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            カテゴリ名：
            <input
              type="text"
              {...register("name", { required: "カテゴリ名は必須です。" })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-red-500 text-xs italic">
              {errors.name?.message as React.ReactNode}
            </p>
          </label>
        </div>
        <div>
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
};

export default CategoryAdd;
