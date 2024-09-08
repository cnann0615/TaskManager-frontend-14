import { MdOutlineTaskAlt } from "react-icons/md";

// layout.tsxのヘッダー
function Header() {
  return (
    <header className="bg-blue-500 text-white font-bold py-4 px-5 md:px-20 ">
      <div className=" flex gap-3">
        <MdOutlineTaskAlt size={35} data-testid="icon" />
        <h1 className=" text-3xl ">Task Manager</h1>
      </div>
    </header>
  );
}

export default Header;
