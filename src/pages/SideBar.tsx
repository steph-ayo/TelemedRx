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
  Menu,
} from "lucide-react";
import Logo from "../assets/logo/leadway-logo.png";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Form", icon: <ClipboardList size={20} />, path: "/dashboard" },
    { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Live Tracking", icon: <Activity size={20} />, path: "/form" },
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
      className={`relative flex flex-col text-black min-h-screen p-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <img
          src={Logo}
          className={`w-34 transition-all duration-300 ${!isOpen && "hidden"}`}
        />
        <button
          className="text-primary cursor-pointer hover:text-white hover:bg-primary p-1 rounded-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 text-text hover:text-white hover:bg-primary rounded-lg px-3 py-2 transition-colors"
          >
            {item.icon}
            <span
              className={`text-sm font-medium transition-all duration-200 ${
                !isOpen && "hidden"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center justify-center gap-3 text-white  bg-primary cursor-pointer rounded-lg py-2 mt-auto transition-colors"
      >
        <LogOut size={20} />
        <span className={`${!isOpen && "hidden"} text-sm font-medium`}>
          Sign Out
        </span>
      </button>
    </div>
  );
};

export default SideBar;
