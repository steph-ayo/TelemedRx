import { ClipboardList, Home, Activity, BarChart3 } from "lucide-react";

export const menuItems = [
  { label: "Form", icon: <ClipboardList size={20} />, path: "/main/form" },
  { label: "Dashboard", icon: <Home size={20} />, path: "/main/dashboard" },
  {
    label: "Live Tracking",
    icon: <Activity size={20} />,
    path: "/main/livetracking",
  },
  { label: "Summary", icon: <BarChart3 size={20} />, path: "/main/summary" },
];
