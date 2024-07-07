import { useAuthState } from "react-firebase-hooks/auth";
import { IoIosLogOut } from "react-icons/io";

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
          className=" flex justify-center items-center gap-2"
          onClick={() => signOut()}
        >
          <p className=" text-sm ">Log Out</p>
          <IoIosLogOut size={25} />
        </button>
      </div>
    </div>
  );
};

export default Account;
