import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
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
      <div className="flex-1 flex flex-col min-w-0">
        <NavBar setIsOpen={setIsOpen} />
        <div className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
