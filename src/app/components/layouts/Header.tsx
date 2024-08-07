import { MdOutlineTaskAlt } from "react-icons/md";

// layout.tsxのヘッダー
function Header() {
  return (
    <header className="bg-blue-500 text-white py-4 px-5 md:px-20 font-bold ">
      <div className=" flex gap-3">
        <MdOutlineTaskAlt size={35} />
        <h1 className=" text-3xl ">Task Manager</h1>
      </div>
    </header>
  );
}
export default Header;
