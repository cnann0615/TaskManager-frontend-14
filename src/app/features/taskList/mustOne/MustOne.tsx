import React, { useContext } from "react";
import Image from "next/image";
import {
  mustTaskContext,
  showTaskDetailContext,
  showTaskDetailEditingContext,
  taskDetailOpenContext,
} from "@/app/Main";
import { TaskItem } from "@/app/@types";

const MustOne = () => {
  // タスク詳細表示処理
  const { setShowTaskDetail } = useContext(showTaskDetailContext);
  // 詳細表示対象タスク編集状態管理State
  const { showTaskDetailEditing } = useContext(showTaskDetailEditingContext);
  // 詳細表示画面展開Stateを定義
  const { setTaskDetailOpen } = useContext(taskDetailOpenContext);
  // マストタスクStateを取得
  const { mustTask } = useContext(mustTaskContext);

  // タスククリック時に詳細を表示する。
  const openTaskDetail = (taskItem: TaskItem) => {
    // 他のタスクの編集中でない時に、クリックしたタスクを詳細表示タスクStateにsetする。
    showTaskDetailEditing || setShowTaskDetail(taskItem);
    // 詳細表示画面を展開する
    setTaskDetailOpen(true);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="mt-7 ml-10 mr-[7%]">
      <div className="flex items-center">
        <Image src={"/mustOne.png"} alt={"mustOne"} width={30} height={30} />
        <h1 className="font-bold text-xl ml-1">Today's Must 1 !</h1>
      </div>
      {mustTask === null ? (
        <p className="px-2 py-3">No Task</p>
      ) : (
        <li className="bg-white border flex items-center justify-between px-2 py-3">
          <span
            onClick={() => openTaskDetail(mustTask)}
            className=" hover:bg-gray-100 font-bold cursor-pointer flex-grow mx-2"
          >
            {mustTask.title}
          </span>
          <span className="text-left w-32">
            〆 {mustTask.deadLine ? mustTask.deadLine : "None"}
          </span>
        </li>
      )}
    </div>
  );
};

export default MustOne;
