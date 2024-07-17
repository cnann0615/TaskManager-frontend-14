import React, { useState } from "react";

import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import NewContentsList from "./newContentsList/NewContentsList";

// NewContentsコンポーネント
const NewContents = () => {
  // New Contents画面展開State定義
  const [addOpen, setAddOpen] = useState(true);
  return (
    <div className=" bg-gray-50 mx-auto my-4 p-4 border rounded-lg shadow">
      <div>
        <div className=" flex items-center gap-2 text-blue-500 text-2xl m-2 font-bold">
          <TbCategoryPlus size={35} />
          {/* New Contents画面の展開ボタン */}
          <h1>New Contents</h1>
          <button
            onClick={() => {
              setAddOpen(!addOpen);
            }}
            className=""
          >
            {addOpen ? (
              <MdOutlineExpandLess size={35} />
            ) : (
              <MdOutlineExpandMore size={35} />
            )}
          </button>
        </div>
      </div>
      {/* New Contents画面が展開されている時は、New Task, New Category, New Scheduleフォームを表示 */}
      {addOpen && <NewContentsList />}
    </div>
  );
};

export default NewContents;
