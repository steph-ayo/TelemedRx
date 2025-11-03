import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ClipboardList,
  Home,
  Activity,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "../assets/logo/leadway-logo.png";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Form",
      icon: <ClipboardList size={20} />,
      path: "/main",
    },
    { label: "Dashboard", icon: <Home size={20} />, path: "/main/dashboard" },
    {
      label: "Live Tracking",
      icon: <Activity size={20} />,
      path: "/live-tracking",
    },
    { label: "Summary", icon: <BarChart3 size={20} />, path: "/users" },
    { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Signed out successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Oops! Something went wrong. Try again.");
      });
  };

  return (
    <div
      className={`fixed lg:relative w-64 h-screen flex flex-col bg-white shadow-xl text-black transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Inner container with padding */}
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="items-center justify-center mb-8">
          <img src={Logo} className="w-34 transition-all duration-300" />
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col gap-3 ">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 text-text rounded-lg px-3 py-2 hover:text-white hover:bg-primary transition-colors duration-300"
            >
              {item.icon}
              <span className="text-sm font-medium transition-all duration-200">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-3 text-white  bg-primary cursor-pointer rounded-lg py-2 mt-auto transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
