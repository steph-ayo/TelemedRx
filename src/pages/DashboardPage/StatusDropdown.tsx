import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { StatusType } from "./types";

interface StatusDropdownProps {
  currentStatus: StatusType;
  onStatusChange: (requestId: string, newStatus: StatusType) => void;
  requestId: string;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  requestId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const statuses: StatusType[] = [
    "Not Sorted",
    "Packed",
    "Sent to Pharmacy",
    "Sent for Delivery",
    "Delivered",
  ];

  const handleStatusSelect = (newStatus: StatusType) => {
    onStatusChange(requestId, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Update Status
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                    currentStatus === status ? "bg-gray-50" : ""
                  }`}
                >
                  <StatusBadge status={status} />
                  {currentStatus === status && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatusDropdown;
