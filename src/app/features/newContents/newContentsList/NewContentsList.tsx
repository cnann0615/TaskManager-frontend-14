import React from "react";
import TaskAdd from "../taskAdd/TaskAdd";
import CategoryAdd from "../categoryAdd/CategoryAdd";
import ScheduleAdd from "../scheduleAdd/ScheduleAdd";

const NewContentsList = () => {
  return (
    <div className=" xl:flex xl:gap-x-7 p-4 ">
      {/* New Task */}
      <div className=" xl:w-2/4">
        <TaskAdd />
      </div>
      {/* New Category */}
      <div className=" xl:w-1/4">
        <CategoryAdd />
      </div>
      {/* New Schedule */}
      <div className=" xl:w-1/4">
        <ScheduleAdd />
      </div>
    </div>
  );
};

export default NewContentsList;
