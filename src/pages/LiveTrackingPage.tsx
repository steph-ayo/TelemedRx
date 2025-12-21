import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
} from "lucide-react";
import { setupDashboardListener } from "../DashBoardService";

interface MedicationRequest {
  id: string;
  date: string;
  name: string;
  enrolleeId: string;
  medications: string;
  diagnosis?: string;
  address?: string;
  status:
    | "Not Sorted"
    | "Packed"
    | "Sent to Pharmacy"
    | "Sent for Delivery"
    | "Delivered"
    | "Returned";
  billed: boolean;
}

const LiveTrackingPage: React.FC = () => {
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MedicationRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Connect to Firebase Firestore - Real-time updates
  useEffect(() => {
    console.log("🔥 Live Tracking: Setting up Firebase listener...");

    const unsubscribe = setupDashboardListener((data) => {
      console.log("📊 Live Tracking: Received data:", data.length, "items");
      setRequests(data);
      setFilteredRequests(data);
      setLastUpdate(new Date());
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      console.log("🛑 Live Tracking: Cleaning up Firebase listener");
      unsubscribe();
    };
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.enrolleeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.medications.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const statusColumns = [
    {
      status: "Not Sorted",
      icon: AlertCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      iconColor: "text-red-500",
    },
    {
      status: "Packed",
      icon: Package,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      iconColor: "text-blue-500",
    },
    {
      status: "Sent to Pharmacy",
      icon: Clock,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      iconColor: "text-purple-500",
    },
    {
      status: "Sent for Delivery",
      icon: Truck,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-500",
    },
    {
      status: "Delivered",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      iconColor: "text-green-500",
    },
    {
      status: "Returned",
      icon: XCircle,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      iconColor: "text-gray-500",
    },
  ];

  const getRequestsByStatus = (status: string) => {
    return filteredRequests.filter((req) => req.status === status);
  };

  const getStatusStyle = (status: string) => {
    const statusMap: Record<string, string> = {
      "Not Sorted": "bg-red-100 text-red-700 border-red-300",
      Packed: "bg-blue-100 text-blue-700 border-blue-300",
      "Sent to Pharmacy": "bg-purple-100 text-purple-700 border-purple-300",
      "Sent for Delivery": "bg-yellow-100 text-yellow-700 border-yellow-300",
      Delivered: "bg-green-100 text-green-700 border-green-300",
      Returned: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Live Tracking
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Search and track medication request status in real-time
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last updated</div>
              <div className="text-sm font-medium text-gray-900">
                {lastUpdate.toLocaleTimeString()}
              </div>
              <div className="mt-1 flex items-center justify-end">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, enrollee ID, medication, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="All">All Status</option>
                {statusColumns.map((col) => (
                  <option key={col.status} value={col.status}>
                    {col.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredRequests.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {requests.length}
              </span>{" "}
              requests
            </span>
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statusColumns.map((column) => {
            const Icon = column.icon;
            const count = getRequestsByStatus(column.status).length;
            return (
              <div
                key={column.status}
                className={`${column.bgColor} border ${column.borderColor} rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${column.iconColor}`} />
                  <span className={`text-2xl font-bold ${column.textColor}`}>
                    {count}
                  </span>
                </div>
                <div className={`text-xs font-medium ${column.textColor}`}>
                  {column.status}
                </div>
              </div>
            );
          })}
        </div>

        {/* List View */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Enrollee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Billing
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.enrolleeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {request.medications}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {request.billed ? (
                          <span className="text-green-600 font-medium">
                            Billed
                          </span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
