import AddButton from "@/app/components/button/AddButton";
import { Schedule } from "../../../@types";
import taskApi from "../../../api/task";
import { scheduleAdd } from "../../../slices/scheduleSlice";
import { useForm } from "react-hook-form";
import { GrSchedules } from "react-icons/gr";

import { useDispatch } from "react-redux";

// 新規スケジュール追加画面
const ScheduleAdd: React.FC = () => {
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
    let orderIndex = await taskApi.maxScheduleOrderIndexGet();
    if (orderIndex) {
      orderIndex += 1;
    } else {
      orderIndex = 1;
    }
    // 新しいスケジュールオブジェクトを作成
    const newSchedule: Schedule = {
      name: schedule.name,
      orderIndex: orderIndex,
    };
    // 新しいスケジュールをAPI経由でデータベースに追加し、結果を取得（スケジュール名が既存のスケジュールと重複した場合、nullが返させる。）
    const scheduleAddSuccess: Schedule = await taskApi.scheduleAdd(newSchedule);
    // スケジュール名が重複せず追加された場合のみ処理を行う。（重複した場合、nullが返されるため以下の処理は行われない。）
    scheduleAddSuccess &&
      (async () => {
        // IDが設定された新しいスケジュールを再度APIを経由してデータベースから取得
        const _newSchedule: Schedule = await taskApi.latestScheduleGet();
        // 新しいスケジュールをスケジュールのStateに追加
        dispatch(scheduleAdd(_newSchedule));
      })();
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
