import { auth } from "@/app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// サインインアカウント情報を表示

const Account = () => {
  // サインイン情報取得
  const [user] = useAuthState(auth);

  //   サインアウトボタンが押されたらサインアウトする
  const signOut = () => {
    auth.signOut();
  };
  return (
    <div className=" flex gap-2 justify-end">
      {/* アイコン（Googleアカウントのアイコン） */}
      <img
        src={auth.currentUser?.photoURL!}
        alt=""
        className=" size-12 rounded-full"
      />
      {/* サインアウトボタン */}
      <button
        className=" flex justify-center items-center "
        onClick={() => signOut()}
      >
        <p className=" text-sm ">Log Out</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </button>
    </div>
  );
};

export default Account;
