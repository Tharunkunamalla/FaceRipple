import SideBar from "./SideBar";
import NavBar from "./NavBar";

const Layout = ({children, showSidebar = false}) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <SideBar />}
        <div className="flex-1 flex flex-col">
          <NavBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
