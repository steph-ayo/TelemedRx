// import React from "react";
// import { FileText } from "lucide-react";
// import StatusBadge from "./StatusBadge";
// import StatusDropdown from "./StatusDropdown";
// import type { MedicationRequest, StatusType } from "../types";

// interface DataTableProps {
//   requests: MedicationRequest[];
//   onStatusChange: (requestId: string, newStatus: StatusType) => void;
//   onBillingChange: (requestId: string, billed: boolean) => void;
// }

// const DataTable: React.FC<DataTableProps> = ({
//   requests,
//   onStatusChange,
//   onBillingChange,
// }) => {
//   if (requests.length === 0) {
//     return (
//       <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//         <p className="text-gray-500">No medication requests found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="w-full max-w-full overflow-x-auto">
//         <table className="min-w-full table-auto divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Enrollee ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Address
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Diagnosis
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Medications
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Source
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 File
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Billed
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {requests.map((request) => (
//               <tr key={request.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {new Date(request.date).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {request.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {request.enrolleeId}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                   {request.address}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {request.diagnosis}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
//                   <div className="truncate" title={request.medications}>
//                     {request.medications}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
//                     {request.source}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {request.fileUrl ? (
//                     <a
//                       href={request.fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:text-blue-800 inline-flex items-center"
//                     >
//                       <FileText className="h-4 w-4 mr-1" />
//                       View
//                     </a>
//                   ) : (
//                     <span className="text-gray-400">No file</span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <StatusBadge status={request.status} />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <label className="inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={request.billed || false}
//                       onChange={(e) =>
//                         onBillingChange(request.id, e.target.checked)
//                       }
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <span className="ml-2 text-gray-700">
//                       {request.billed ? "Yes" : "No"}
//                     </span>
//                   </label>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <StatusDropdown
//                     currentStatus={request.status}
//                     onStatusChange={onStatusChange}
//                     requestId={request.id}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
//         ← Scroll horizontally to view all columns →
//       </div>
//     </div>
//   );
// };

// export default DataTable;

import React, { useState } from "react";
import { FileText, Edit2, Trash2, X, Save } from "lucide-react";
import StatusBadge from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";
import type { MedicationRequest, StatusType } from "../types";
import { updateMedicationDetails } from "../../../../src/DashBoardService";

interface DataTableProps {
  requests: MedicationRequest[];
  onStatusChange: (requestId: string, newStatus: StatusType) => void;
  onBillingChange: (requestId: string, billed: boolean) => void;
  onDelete: (requestId: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  requests,
  onStatusChange,
  onBillingChange,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MedicationRequest>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (request: MedicationRequest) => {
    setEditingId(request.id);
    setEditForm({
      name: request.name,
      enrolleeId: request.enrolleeId,
      address: request.address,
      diagnosis: request.diagnosis,
      medications: request.medications,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (requestId: string) => {
    setIsSaving(true);

    const result = await updateMedicationDetails(requestId, editForm);

    if (result.success) {
      setEditingId(null);
      setEditForm({});
    } else {
      alert("Failed to update. Please try again.");
    }

    setIsSaving(false);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No medication requests found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="w-full max-w-full overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollee ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => {
              const isEditing = editingId === request.id;

              return (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(request.date).toLocaleDateString()}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      request.name
                    )}
                  </td>

                  {/* Enrollee ID */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.enrolleeId || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            enrolleeId: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      request.enrolleeId
                    )}
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {isEditing ? (
                      <textarea
                        value={editForm.address || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded resize-none"
                        rows={2}
                      />
                    ) : (
                      <div className="max-w-xs truncate">{request.address}</div>
                    )}
                  </td>

                  {/* Diagnosis */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.diagnosis || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            diagnosis: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      request.diagnosis
                    )}
                  </td>

                  {/* Medications */}
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {isEditing ? (
                      <textarea
                        value={editForm.medications || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            medications: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded resize-none"
                        rows={2}
                      />
                    ) : (
                      <div className="truncate" title={request.medications}>
                        {request.medications}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {request.source}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.fileUrl ? (
                      <a
                        href={request.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={request.billed || false}
                        onChange={(e) =>
                          onBillingChange(request.id, e.target.checked)
                        }
                        disabled={isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        {request.billed ? "Yes" : "No"}
                      </span>
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(request.id)}
                          disabled={isSaving}
                          className="flex flex-row gap-1 text-green-600 hover:text-green-800 disabled:opacity-50 cursor-pointer"
                          title="Save"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="flex flex-row gap-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <StatusDropdown
                          currentStatus={request.status}
                          onStatusChange={onStatusChange}
                          requestId={request.id}
                        />
                        <button
                          onClick={() => handleEditClick(request)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(request.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
        ← Scroll horizontally to view all columns →
      </div>
    </div>
  );
};

export default DataTable;
