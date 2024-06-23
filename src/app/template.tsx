import React from "react";

import StoreProvider from "./components/StoreProvider";

function Template({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

export default Template;
