import React, { useState } from "react";
import { Menu, Bell, UserCircle, LogOut } from "lucide-react";
import user from "../assets/images/user.jpg";

interface NavBarProps {
  setIsOpen: (isOpen: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setIsOpen }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex flex-row p-3 justify-between shadow-lg">
        {/* Burger icon for mobile view */}
        <div
          className="toggle lg:hidden text-2xl text-primary cursor-pointer hover:text-white hover:bg-primary hover:rounded-sm hover:p-1"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </div>

        {/* Nav title */}
        <div className="md:ml-30">
          <h1 className="text-2xl font-semibold">Title</h1>
        </div>

        {/* Right nav container */}
        <div className="flex flex-row gap-2">
          {/* Notification */}
          <div className="items-center text-xl p-2 cursor-pointer border border-gray-500 rounded-full lg:flex justify-center relative hover:bg-primary hover:text-white transition-colors duration-300">
            <Bell size={20} />
            <span className="text-xs text-white bg-primary px-1 rounded-2xl absolute top-0 right-0">
              2
            </span>
          </div>

          {/* Nav User-Profile */}
          <div className="cursor-pointer rounded-2xl flex justify-center items-center relative">
            {/* User image container */}
            <div
              className="w-10 h-10 rounded-full overflow-hidden relative cursor-pointer"
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            >
              <img
                src={user}
                alt="user-image"
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
              />
              <div className="absolute inset-0 bg-primary mix-blend-color"></div>
            </div>

            {isUserMenuOpen && (
              <ul className="absolute top-12 right-0 bg-white w-[200px] p-3 flex flex-col gap-3 rounded-2xl shadow-xl z-50 ">
                <li>
                  <a
                    href="/Profile"
                    className="text-md hover:text-primary transition-colors duration-300 flex items-center"
                  >
                    <UserCircle size={20} className="mr-2" />
                    Signed in as ...
                  </a>
                </li>

                <li>
                  <a
                    href="/logout"
                    className="text-md hover:text-primary transition-colors duration-300 flex items-center"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
