import React from "react";
import type { StatusType } from "../types";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<
    StatusType,
    { bg: string; text: string; border: string }
  > = {
    "Not Sorted": {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-300",
    },
    Packed: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
    },
    "Sent to Pharmacy": {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
    },
    "Sent for Delivery": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-300",
    },
    Delivered: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300",
    },
  };

  const config = statusConfig[status] || statusConfig["Not Sorted"];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
