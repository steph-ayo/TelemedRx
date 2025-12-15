export interface MedicationRequest {
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

export type StatusType = MedicationRequest["status"];
