import { useDispatch } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/app/firebase";

// サインインアカウント情報を表示

const Account = () => {
  // 挨拶メッセージ定義
  const hours = new Date().getHours();
  let greeting;
  if (hours < 10) {
    greeting = "おはようございます。";
  } else if (hours < 18) {
    greeting = "こんにちは。";
  } else {
    greeting = "こんばんは。";
  }

  // サインイン情報取得
  const [user] = useAuthState(auth);

  //   サインアウトボタンが押されたらサインアウトする
  const signOut = () => {
    auth.signOut();
    // ブラウザをリロードする（状態管理をリセットするため）
    location.reload();
  };
  return (
    <div className=" flex justify-between">
      <div className=" flex items-center">
        <p>
          {auth.currentUser?.displayName}さん、{greeting}
        </p>
      </div>
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
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Account;
