import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../assets/logo/leadway-logo.png";
import { menuItems } from "./MenuItems";
import { LogOut } from "lucide-react";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  //  Signout function
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
      {/* Inner container */}
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="items-center justify-center mb-8">
          <img src={Logo} className="w-34 transition-all duration-300" />
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col gap-3 ">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-300 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text hover:bg-gray-400 hover:text-white transition-colors duration-300"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium transition-all duration-200">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-3 text-white  bg-text cursor-pointer rounded-lg py-2 mt-auto transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
