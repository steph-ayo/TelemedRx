import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, LogOut } from "lucide-react";
import { menuItems } from "./MenuItems";

interface NavBarProps {
  setIsOpen: (isOpen: boolean) => void;
  handleSignOut: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ setIsOpen, handleSignOut }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const activeItem = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Open menu"
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* Page Title */}
          <h1 className="text-lg lg:text-xl font-semibold text-gray-800 tracking-tight">
            {activeItem?.label || "Leadway"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Notifications Button */}
          <button
            className="relative p-2 lg:p-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell
              size={20}
              className="text-gray-600 group-hover:text-primary transition-colors"
            />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40"></span>
              <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-primary text-[10px] font-semibold text-white">
                2
              </span>
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 lg:gap-2.5 px-2 py-1.5 lg:px-3 lg:py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              {/* Avatar with primary color overlay */}
              <div className="relative w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-primary transition-all duration-200">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Cpath d='M50 45a12 12 0 100-24 12 12 0 000 24zM30 75c0-11 9-20 20-20s20 9 20 20' fill='%239ca3af'/%3E%3C/svg%3E"
                  alt="User"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary opacity-10"></div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    pharmacybenefitmgt@leadway.com
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <a
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                  >
                    <LogOut size={18} className="text-gray-400" />
                    <span className="font-medium">Logout</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
