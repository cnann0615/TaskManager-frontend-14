import React from "react";
import TaskAdd from "./taskAdd/TaskAdd";
import CategoryAdd from "./categoryAdd/CategoryAdd";
import ScheduleAdd from "./scheduleAdd/ScheduleAdd";

const NewContentsList = React.memo(() => {
  return (
    <div className=" xl:flex xl:gap-x-7 p-4 ">
      <div className=" xl:w-2/4">
        <TaskAdd />
      </div>
      <div className=" xl:w-1/4">
        <CategoryAdd />
      </div>
      <div className=" xl:w-1/4">
        <ScheduleAdd />
      </div>
    </div>
  );
});

NewContentsList.displayName = "NewContentsList";
export default NewContentsList;
