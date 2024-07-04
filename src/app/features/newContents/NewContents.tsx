import React from "react";
import TaskAdd from "./taskAdd/TaskAdd";
import CategoryAdd from "./categoryAdd/CategoryAdd";
import ScheduleAdd from "./scheduleAdd/ScheduleAdd";

const NewContents = () => {
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
};

export default NewContents;
