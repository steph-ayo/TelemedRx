import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { useState } from "react";

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main conent */}
      <div className="flex-1 flex flex-col">
        <NavBar setIsOpen={setIsOpen} />
        <div className="flex-1 overflow-y-auto ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
