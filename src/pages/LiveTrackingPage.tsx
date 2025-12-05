import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface MedicationRequest {
  id: string;
  date: string;
  name: string;
  enrolleeId: string;
  medications: string;
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
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock data - Replace with Firestore listener
  useEffect(() => {
    const mockData: MedicationRequest[] = [
      {
        id: "1",
        date: "2025-12-05",
        name: "John Doe",
        enrolleeId: "ENR-001",
        medications: "Lisinopril 10mg",
        status: "Not Sorted",
        billed: false,
      },
      {
        id: "2",
        date: "2025-12-05",
        name: "Jane Smith",
        enrolleeId: "ENR-002",
        medications: "Metformin 500mg",
        status: "Packed",
        billed: true,
      },
      {
        id: "3",
        date: "2025-12-04",
        name: "Michael Johnson",
        enrolleeId: "ENR-003",
        medications: "Albuterol inhaler",
        status: "Sent to Pharmacy",
        billed: false,
      },
      {
        id: "4",
        date: "2025-12-04",
        name: "Sarah Williams",
        enrolleeId: "ENR-004",
        medications: "Amoxicillin 500mg",
        status: "Sent for Delivery",
        billed: true,
      },
      {
        id: "5",
        date: "2025-12-03",
        name: "David Brown",
        enrolleeId: "ENR-005",
        medications: "Ibuprofen 400mg",
        status: "Delivered",
        billed: true,
      },
      {
        id: "6",
        date: "2025-12-03",
        name: "Emily Davis",
        enrolleeId: "ENR-006",
        medications: "Omeprazole 20mg",
        status: "Returned",
        billed: false,
      },
    ];

    setTimeout(() => {
      setRequests(mockData);
      setLoading(false);
    }, 1000);

    // TODO: Replace with Firestore real-time listener
    // import { collection, onSnapshot, query } from 'firebase/firestore';
    // const q = query(collection(db, 'medications'));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicationRequest));
    //   setRequests(data);
    //   setLastUpdate(new Date());
    //   setLoading(false);
    // });
    // return () => unsubscribe();
  }, []);

  const statusColumns = [
    {
      status: "Not Sorted",
      icon: AlertCircle,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      iconColor: "text-red-500",
    },
    {
      status: "Packed",
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      iconColor: "text-blue-500",
    },
    {
      status: "Sent to Pharmacy",
      icon: Clock,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      iconColor: "text-purple-500",
    },
    {
      status: "Sent for Delivery",
      icon: Truck,
      color: "yellow",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-500",
    },
    {
      status: "Delivered",
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      iconColor: "text-green-500",
    },
    {
      status: "Returned",
      icon: XCircle,
      color: "gray",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      iconColor: "text-gray-500",
    },
  ];

  const getRequestsByStatus = (status: string) => {
    return requests.filter((req) => req.status === status);
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
                Real-time medication request status tracking
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

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4 min-w-full">
            {statusColumns.map((column) => {
              const Icon = column.icon;
              const columnRequests = getRequestsByStatus(column.status);

              return (
                <div
                  key={column.status}
                  className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* Column Header */}
                  <div
                    className={`${column.bgColor} border-b ${column.borderColor} p-4 rounded-t-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${column.iconColor}`} />
                        <h3 className={`font-semibold ${column.textColor}`}>
                          {column.status}
                        </h3>
                      </div>
                      <span
                        className={`${column.bgColor} ${column.textColor} px-2 py-1 rounded-full text-xs font-semibold border ${column.borderColor}`}
                      >
                        {columnRequests.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Content */}
                  <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                    {columnRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No requests
                      </div>
                    ) : (
                      columnRequests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {request.name}
                            </h4>
                            {request.billed && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                Billed
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            ID: {request.enrolleeId}
                          </p>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                            {request.medications}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {new Date(request.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
