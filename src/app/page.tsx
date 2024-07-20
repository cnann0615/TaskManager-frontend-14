"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import Main from "./Main";
import SignIn from "./features/signIn/SignIn";

const Top = () => {
  // サインイン情報取得（サインイン時はuserがtrue）
  const [user] = useAuthState(auth);

  return (
    <div className="">
      {user ? (
        <>
          <Main />
        </>
      ) : (
        <div className=" mt-[15%]">
          <SignIn />
        </div>
      )}
    </div>
  );
};

export default Top;
