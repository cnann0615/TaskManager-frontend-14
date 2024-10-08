"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import React from "react";

import { store } from "../store/store";

// ReduxのStoreを利用可能にするためのコンポーネント
// use clientとなるため、template.tsxでは定義できずに、本コンポーネントに切り離した。

type StoreProviderProps = {
  children: ReactNode;
};

function StoreProvider({ children }: Readonly<StoreProviderProps>) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}

export default StoreProvider;
