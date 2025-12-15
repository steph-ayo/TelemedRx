import React, { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import DataTable from "./components/DataTable";

interface MedicationRequest {
  id: string;
  date: string;
  name: string;
  enrolleeId: string;
  address: string;
  diagnosis: string;
  medications: string;
  source: string;
  fileUrl: string | null;
  status:
    | "Not Sorted"
    | "Packed"
    | "Sent to Pharmacy"
    | "Sent for Delivery"
    | "Delivered";
  billed: boolean;
}

const DashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MedicationRequest[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data - Replace with actual Firestore integration
  useEffect(() => {
    // Simulate fetching data
    const mockData: MedicationRequest[] = [
      {
        id: "1",
        date: "2025-11-08",
        name: "John Doe",
        enrolleeId: "2512345/0",
        address: "123 Main St, Lagos",
        diagnosis: "Hypertension",
        medications: "Lisinopril 10mg, Amlodipine 5mg",
        source: "Telemedicine",
        fileUrl: "#",
        status: "Not Sorted",
        billed: false,
      },
      {
        id: "2",
        date: "2025-11-07",
        name: "Jane Smith",
        enrolleeId: "2512345/1",
        address: "456 Oak Ave, Abuja",
        diagnosis: "Diabetes Type 2",
        medications: "Metformin 500mg, Glimepiride 2mg",
        source: "Acute",
        fileUrl: "#",
        status: "Packed",
        billed: true,
      },
      {
        id: "3",
        date: "2025-11-07",
        name: "Michael Johnson",
        enrolleeId: "2512345/2",
        address: "789 Elm St, Port Harcourt",
        diagnosis: "Asthma",
        medications: "Albuterol inhaler, Fluticasone",
        source: "Telemedicine",
        fileUrl: null,
        status: "Delivered",
        billed: true,
      },
    ];

    setTimeout(() => {
      setRequests(mockData);
      setFilteredRequests(mockData);
      setLoading(false);
    }, 1000);

    // TODO: Replace with Firestore real-time listener
    // const unsubscribe = onSnapshot(collection(db, 'medicationRequests'), (snapshot) => {
    //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicationRequest));
    //   setRequests(data);
    //   setFilteredRequests(data);
    //   setLoading(false);
    // });
    // return () => unsubscribe();
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
          req.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== "All") {
      filtered = filtered.filter((req) => req.source === sourceFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, sourceFilter, requests]);

  const handleStatusChange = (
    requestId: string,
    newStatus: MedicationRequest["status"]
  ) => {
    // Update local state
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    // TODO: Update Firestore
    // updateDoc(doc(db, 'medicationRequests', requestId), { status: newStatus });

    console.log(`Updated request ${requestId} to status: ${newStatus}`);
  };

  const handleBillingChange = (requestId: string, billed: boolean) => {
    // Update local state
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, billed } : req))
    );

    // TODO: Update Firestore
    // updateDoc(doc(db, 'medicationRequests', requestId), { billed });

    console.log(`Updated request ${requestId} billing status: ${billed}`);
  };

  const exportData = () => {
    // Simple CSV export
    const headers = [
      "Date",
      "Name",
      "Enrollee ID",
      "Address",
      "Diagnosis",
      "Medications",
      "Source",
      "Status",
      "Billed",
    ];
    const rows = filteredRequests.map((req) => [
      new Date(req.date).toLocaleDateString(),
      req.name,
      req.enrolleeId,
      req.address,
      req.diagnosis,
      req.medications,
      req.source,
      req.status,
      req.billed ? "Yes" : "No",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medication-requests-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  const uniqueSources = ["All", ...new Set(requests.map((r) => r.source))];
  const statuses = [
    "All",
    "Not Sorted",
    "Packed",
    "Sent to Pharmacy",
    "Sent for Delivery",
    "Delivered",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Medication Requests Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all medication requests in real-time
          </p>
        </div>

        {/* Filters Container */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, enrollee ID, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status} Status
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div className="flex gap-2">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              >
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>
                    {source} Source
                  </option>
                ))}
              </select>

              <button
                onClick={exportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none inline-flex items-center"
                title="Export to CSV"
              >
                <Download className="h-5 w-5" />
              </button>
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
            {(searchTerm ||
              statusFilter !== "All" ||
              sourceFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setSourceFilter("All");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          requests={filteredRequests}
          onStatusChange={handleStatusChange}
          onBillingChange={handleBillingChange}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
