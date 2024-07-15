"use client";
import { auth, provider } from "@/app/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

// サインインページ
const SignIn = () => {
  // サインインボタン押下時
  const signInWithGoogle = () => {
    // Googleアカウント認証を実行（認証されると上記userがtrueになる。）
    signInWithPopup(auth, provider)
      .then((result) => {
        // ユーザーが正常にサインインした場合の処理
        console.log("サインイン成功:", result.user);
      })
      .catch((error) => {
        if (error.code === "auth/popup-closed-by-user") {
          // ポップアップがユーザーによって閉じられた場合の処理
          console.error("ポップアップが閉じられました。再度お試しください。");
          alert("ポップアップが閉じられました。再度お試しください。");
        } else {
          // その他のエラー処理
          console.error("エラーが発生しました:", error.message);
          alert("エラーが発生しました。再度お試しください。");
        }
      });
  };
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 text-center">
        <h3 className="text-gray-700 text-2xl md:text-5xl mb-8 font-bold ">
          Get started with
        </h3>
        <div className="flex items-center gap-3 mb-8">
          <MdOutlineTaskAlt className=" size-10  md:size-20" />
          <h1 className="text-4xl md:text-7xl font-bold ">Task Manager！</h1>
        </div>
        {/* サインインボタン */}
        <button
          onClick={signInWithGoogle}
          className="bg-white text-blue-500 font-bold py-2 px-4 rounded-xl hover:bg-gray-100 transition duration-300 border-2 border-gray-200"
        >
          <div className=" flex items-center gap-2">
            <FcGoogle className=" size-6 md:size-12" />
            <h3 className=" text-lg md:text-2xl ">Sign In</h3>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
