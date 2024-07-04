"use client";
import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Main from "./Main";

const SignIn = () => {
  // ログイン状態を管理する
  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
        <>
          <div className=" flex ">
            <UserInfo />
            <SignOutButton />
          </div>
          <Main />
        </>
      ) : (
        <SignInButton />
      )}
    </>
  );
};

export default SignIn;

// Googleボタンでサインイン
function SignInButton() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };
  return (
    <div className="min-h-screen -mt-[60px] flex items-center justify-center bg-slate-300 ">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-5xl mb-8 font-bold ">
          Get started with Task Manager!
        </h1>
        <button
          onClick={signInWithGoogle}
          className="text-2xl bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Googleでサインイン
        </button>
      </div>
    </div>
  );
}

// Googleボタンでサインアウト
export function SignOutButton() {
  return (
    <button onClick={() => auth.signOut()}>
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
  );
}

export function UserInfo() {
  return (
    <div className="userInfo">
      <img src={auth.currentUser?.photoURL!} alt="" className=" size-12" />
    </div>
  );
}
