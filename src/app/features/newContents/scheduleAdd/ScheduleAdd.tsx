import { useForm } from "react-hook-form";
import { GrSchedules } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

import AddButton from "@/app/components/button/AddButton";
import { Schedule } from "../../../@types";
import taskApi from "../../../api/task";
import { addScheduleThunk } from "../../../slices/scheduleSlice";

// 新規スケジュール追加画面
const ScheduleAdd: React.FC = () => {
  // サインイン情報取得
  const [user] = useAuthState(auth);
  const userId = auth.currentUser!.uid;
  // Reduxのdispatchを使用可能にする
  const dispatch = useDispatch();

  // useFormを使用したフォームの処理///////////
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Schedule>({ mode: "onSubmit" });

  const onSubmit = async (schedule: Schedule) => {
    // APIから新規タスク用のorderIndexを取得
    let orderIndex = await taskApi.maxScheduleOrderIndexGet(userId);
    if (orderIndex) {
      orderIndex += 1;
    } else {
      orderIndex = 1;
    }
    // 新しいスケジュールオブジェクトを作成
    const newSchedule: Schedule = {
      userId: userId,
      name: schedule.name,
      orderIndex: orderIndex,
    };
    // 新規スケジュールをDB,スケジュールRedux Stateに反映
    dispatch(addScheduleThunk({ userId, newSchedule }));
    reset();
  };

  return (
    <div>
      <div className=" flex items-center gap-2">
        <GrSchedules size={25} />
        <h3 className="font-bold">New Schedule</h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white mx-auto mt-4 mb-10 p-4 border rounded-lg shadow"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <div className=" flex justify-between">
              <p>Schedule</p>
              <p className="text-red-500 text-xs ">
                {errors.name?.message as React.ReactNode}
              </p>
            </div>
            <input
              type="text"
              {...register("name", { required: "Schedule is required" })}
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

export default ScheduleAdd;
