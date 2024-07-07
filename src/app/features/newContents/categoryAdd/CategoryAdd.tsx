import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { MdOutlineCategory } from "react-icons/md";

import AddButton from "@/app/components/button/AddButton";
import { Category } from "../../../@types";
import taskApi from "../../../api/task";
import { categoryAdd } from "../../../slices/categorySlice";

// 新規カテゴリ追加画面
const CategoryAdd: React.FC = () => {
  const dispatch = useDispatch();

  // useFormを使用したフォームの処理///////////
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Category>({ mode: "onSubmit" });

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
      <div className=" flex items-center gap-2">
        <MdOutlineCategory size={25} />
        <h3 className="font-bold">New Category</h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white mx-auto mt-4 mb-10 p-4 border rounded-lg shadow"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <div className=" flex justify-between">
              <p>Category</p>
              <p className="text-red-500 text-xs ">
                {errors.name?.message as React.ReactNode}
              </p>
            </div>

            <input
              type="text"
              {...register("name", { required: "Category is required." })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className=" flex justify-end">
          <AddButton />
        </div>
      </form>
    </div>
  );
};

export default CategoryAdd;
