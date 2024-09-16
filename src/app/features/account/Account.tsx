import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoIosLogOut } from "react-icons/io";

import { auth } from "@/app/firebase";

// サインインアカウント情報を表示

const Account = React.memo(() => {
  const [user] = useAuthState(auth);

  // 挨拶メッセージ定義
  const hours = new Date().getHours();
  let greeting;
  if (hours < 10) {
    greeting = "Good morning";
  } else if (hours < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const signOut = async () => {
    try {
      await auth.signOut();
      // ブラウザをリロードする（状態管理をリセットするため）
      location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("サインアウト中にエラーが発生しました。");
    }
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <p className="ml-3">
          {greeting}, {user?.displayName}！
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="size-12 rounded-full"
          />
        )}
        <button
          className="flex justify-center items-center gap-2"
          onClick={signOut}
        >
          <p className="text-sm">Sign Out</p>
          <IoIosLogOut size={25} />
        </button>
      </div>
    </div>
  );
});

Account.displayName = "Account";
export default Account;
