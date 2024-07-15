import React from "react";
import StoreProvider from "./components/StoreProvider";

// template.tsxは全てのコンポーネントをラップする。（layout.tsxよりは内側に位置する。）
// 再レンダリングあり。（layout.tsxは再レンダリングなし。）

// StoreProvider（<Provider>はuse clientとなるため、<StoreProvider>に切り離している。）で全てのコンポーネントをラップし、Reduxでの状態管理を可能にしている。
function Template({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

export default Template;
