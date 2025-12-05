import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";

interface MedicationRequest {
  id: string;
  date: string;
  name: string;
  status: string;
  billed: boolean;
  billingAmount?: number;
}

const SummaryPage = () => {
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const mockData: MedicationRequest[] = [
      {
        id: "1",
        date: "2025-12-05",
        name: "John Doe",
        status: "Not Sorted",
        billed: false,
        billingAmount: 0,
      },
      {
        id: "2",
        date: "2025-12-05",
        name: "Jane Smith",
        status: "Packed",
        billed: true,
        billingAmount: 5500,
      },
      {
        id: "3",
        date: "2025-12-04",
        name: "Michael Johnson",
        status: "Sent to Pharmacy",
        billed: false,
      },
      {
        id: "4",
        date: "2025-12-04",
        name: "Sarah Williams",
        status: "Sent for Delivery",
        billed: true,
        billingAmount: 3200,
      },
      {
        id: "5",
        date: "2025-12-03",
        name: "David Brown",
        status: "Delivered",
        billed: true,
        billingAmount: 8900,
      },
      {
        id: "6",
        date: "2025-12-03",
        name: "Emily Davis",
        status: "Returned",
        billed: false,
      },
      {
        id: "7",
        date: "2025-12-02",
        name: "Chris Wilson",
        status: "Delivered",
        billed: true,
        billingAmount: 4700,
      },
      {
        id: "8",
        date: "2025-12-01",
        name: "Amanda Taylor",
        status: "Delivered",
        billed: true,
        billingAmount: 6100,
      },
    ];

    setTimeout(() => {
      setRequests(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filterByDateRange = (reqs: MedicationRequest[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateRange === "today") {
      return reqs.filter((r) => new Date(r.date) >= today);
    } else if (dateRange === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reqs.filter((r) => new Date(r.date) >= weekAgo);
    } else if (dateRange === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return reqs.filter((r) => new Date(r.date) >= monthAgo);
    }
    return reqs;
  };

  const filteredRequests = filterByDateRange(requests);
  const total = filteredRequests.length;
  const delivered = filteredRequests.filter(
    (r) => r.status === "Delivered"
  ).length;
  const billed = filteredRequests.filter((r) => r.billed).length;
  const unbilled = filteredRequests.filter((r) => !r.billed).length;
  const totalRevenue = filteredRequests.reduce(
    (sum, r) => sum + (r.billingAmount || 0),
    0
  );
  const completionRate =
    total > 0 ? ((delivered / total) * 100).toFixed(1) : "0";

  const statusCounts = {
    "Not Sorted": filteredRequests.filter((r) => r.status === "Not Sorted")
      .length,
    Packed: filteredRequests.filter((r) => r.status === "Packed").length,
    "Sent to Pharmacy": filteredRequests.filter(
      (r) => r.status === "Sent to Pharmacy"
    ).length,
    "Sent for Delivery": filteredRequests.filter(
      (r) => r.status === "Sent for Delivery"
    ).length,
    Delivered: delivered,
    Returned: filteredRequests.filter((r) => r.status === "Returned").length,
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
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Summary & Analytics
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Overview of medication requests and performance metrics
              </p>
            </div>
            <div className="flex gap-2">
              {["today", "week", "month", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    dateRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {delivered}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Rate: {completionRate}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₦{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Billed: {billed} / Unbilled: {unbilled}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {statusCounts["Not Sorted"] +
                    statusCounts["Packed"] +
                    statusCounts["Sent to Pharmacy"]}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status Distribution
            </h2>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const percentage =
                  total > 0 ? ((count / total) * 100).toFixed(1) : "0";
                const colors: Record<string, string> = {
                  "Not Sorted": "bg-red-500",
                  Packed: "bg-blue-500",
                  "Sent to Pharmacy": "bg-purple-500",
                  "Sent for Delivery": "bg-yellow-500",
                  Delivered: "bg-green-500",
                  Returned: "bg-gray-500",
                };
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[status]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Billing Overview
            </h2>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {billed}
                </div>
                <div className="text-sm text-green-700 mt-1">Billed</div>
                <div className="text-xs text-green-600 mt-1">
                  {total > 0 ? ((billed / total) * 100).toFixed(1) : "0"}%
                </div>
              </div>
              <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  {unbilled}
                </div>
                <div className="text-sm text-red-700 mt-1">Unbilled</div>
                <div className="text-xs text-red-600 mt-1">
                  {total > 0 ? ((unbilled / total) * 100).toFixed(1) : "0"}%
                </div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-semibold">
                  ₦{totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Average per Request
                </span>
                <span className="text-sm font-semibold">
                  ₦
                  {billed > 0
                    ? Math.round(totalRevenue / billed).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Billing
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.slice(0, 10).map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(req.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {req.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : req.status === "Not Sorted"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {req.billed ? (
                        <span className="text-green-600 font-medium">
                          Billed
                        </span>
                      ) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {req.billingAmount
                        ? `₦${req.billingAmount.toLocaleString()}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
