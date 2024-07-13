import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { MdOutlineCategory } from "react-icons/md";

import AddButton from "@/app/components/button/AddButton";
import { Category } from "../../../@types";
import taskApi from "../../../api/task";
import { addCategoryThunk, categoryAdd } from "../../../slices/categorySlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

// 新規カテゴリ追加画面
const CategoryAdd: React.FC = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const userId = auth.currentUser!.uid;

  // useFormを使用したフォームの処理///////////
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Category>({ mode: "onSubmit" });

  const onSubmit = async (category: Category) => {
    // APIから新規タスク用のorderIndexを取得
    let orderIndex = await taskApi.maxCategoryOrderIndexGet(userId);
    if (orderIndex) {
      orderIndex += 1;
    } else {
      orderIndex = 1;
    }
    // 新しいカテゴリオブジェクトを作成
    const newCategory: Category = {
      userId: userId,
      name: category.name,
      orderIndex: orderIndex,
    };
    // 新規タスクをDB,Stateに反映
    dispatch(addCategoryThunk({ userId, newCategory }));
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
