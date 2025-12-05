import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  //  Parent Signout function
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
        <NavBar setIsOpen={setIsOpen} handleSignOut={handleSignOut} />
        <div className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
