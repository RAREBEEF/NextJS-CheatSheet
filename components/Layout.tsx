import Nav from "./Nav";
import React from "react";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Nav />
      <div>{children}</div>
    </>
  );
};

export default Layout;
