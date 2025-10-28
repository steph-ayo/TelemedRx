import SideBar from "./SideBar";
import { useState } from "react";

const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay */}
      <div className="relative flex-1">
        {isOpen && (
          <div
            className="absolute inset-0 backdrop-blur-xs bg-white/10 lg:hidden z-10"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        <main className="relative z-0 p-6 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-semibold">Dashboard Content</h1>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
