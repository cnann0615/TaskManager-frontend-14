import React, { useState } from "react";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import NewContentsList from "./newContentsList/NewContentsList";

// NewContentsコンポーネント
const NewContents = React.memo(() => {
  // New Contents画面展開State定義
  const [addOpen, setAddOpen] = useState(true);
  return (
    <div className=" bg-gray-50 border rounded-lg shadow mx-auto my-4 p-4">
      <div>
        <div className=" text-blue-500 text-2xl font-bold flex items-center gap-2 m-2 ">
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
});

NewContents.displayName = "NewContents";
export default NewContents;
