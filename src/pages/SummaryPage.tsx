import { useState, useEffect } from "react";
import { DollarSign, Package } from "lucide-react";
import { setupDashboardListener } from "../DashBoardService";

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

  // Connect to Firebase Firestore
  useEffect(() => {
    console.log("Summary: Setting up Firebase listener...");

    const unsubscribe = setupDashboardListener((data) => {
      console.log("📊 Summary: Received data:", data.length, "items");
      setRequests(data);
      setLoading(false);
    });

    return () => {
      console.log("Summary: Cleaning up Firebase listener");
      unsubscribe();
    };
  }, []);

  const total = requests.length;
  const billed = requests.filter((r) => r.billed).length;
  const unbilled = requests.filter((r) => !r.billed).length;

  const statusCounts = {
    "Not Sorted": requests.filter((r) => r.status === "Not Sorted").length,
    Packed: requests.filter((r) => r.status === "Packed").length,
    "Sent to Pharmacy": requests.filter((r) => r.status === "Sent to Pharmacy")
      .length,
    "Sent for Delivery": requests.filter(
      (r) => r.status === "Sent for Delivery"
    ).length,
    Delivered: requests.filter((r) => r.status === "Delivered").length,
    Returned: requests.filter((r) => r.status === "Returned").length,
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Summary</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of all medication requests
          </p>
        </div>

        {/* Total Requests Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Requests
              </p>
              <p className="text-5xl font-bold text-gray-900 mt-2">{total}</p>
              <p className="text-sm text-gray-500 mt-2">
                All time medication requests
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Status Distribution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const colors: Record<
                string,
                { bg: string; text: string; border: string }
              > = {
                "Not Sorted": {
                  bg: "bg-red-50",
                  text: "text-red-700",
                  border: "border-red-200",
                },
                Packed: {
                  bg: "bg-blue-50",
                  text: "text-blue-700",
                  border: "border-blue-200",
                },
                "Sent to Pharmacy": {
                  bg: "bg-purple-50",
                  text: "text-purple-700",
                  border: "border-purple-200",
                },
                "Sent for Delivery": {
                  bg: "bg-yellow-50",
                  text: "text-yellow-700",
                  border: "border-yellow-200",
                },
                Delivered: {
                  bg: "bg-green-50",
                  text: "text-green-700",
                  border: "border-green-200",
                },
                Returned: {
                  bg: "bg-gray-50",
                  text: "text-gray-700",
                  border: "border-gray-200",
                },
              };
              const style = colors[status];
              return (
                <div
                  key={status}
                  className={`${style.bg} border ${style.border} rounded-lg p-4`}
                >
                  <div className={`text-3xl font-bold ${style.text}`}>
                    {count}
                  </div>
                  <div className={`text-sm font-medium ${style.text} mt-1`}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Billing Overview
            </h2>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-4xl font-bold text-green-600">{billed}</div>
              <div className="text-sm text-green-700 mt-1 font-medium">
                Billed Requests
              </div>
              <div className="text-xs text-green-600 mt-2">
                {total > 0 ? ((billed / total) * 100).toFixed(1) : "0"}% of
                total
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-4xl font-bold text-red-600">{unbilled}</div>
              <div className="text-sm text-red-700 mt-1 font-medium">
                Unbilled Requests
              </div>
              <div className="text-xs text-red-600 mt-2">
                {total > 0 ? ((unbilled / total) * 100).toFixed(1) : "0"}% of
                total
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
