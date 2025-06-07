import React from "react";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const Layout = ({showSidebar = false}) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <SideBar />}
        <div className="flex-1 flex flex-col">
          <NavBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
