import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../src/config/firebase";
import type { MedicationRequest } from "./pages/Dashboard/types";

// Real-time listener for all medications
export function setupDashboardListener(
  callback: (medications: MedicationRequest[]) => void
) {
  const q = query(collection(db, "medications"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const medications: MedicationRequest[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        medications.push({
          id: doc.id,
          date: data.date || "",
          name: data.name || "",
          enrolleeId: data.enrolleeId || "",
          address: data.address || "",
          diagnosis: data.diagnosis || "",
          medications: data.medications || "",
          source: data.source || "",
          fileUrl: data.fileUrl || null,
          status: data.status || "Not Sorted",
          billed: data.billed || false,
        });
      });

      callback(medications);
    },
    (error) => {
      console.error("Error listening to medications:", error);
    }
  );

  return unsubscribe;
}

// Update status
export async function updateMedicationStatus(
  medicationId: string,
  newStatus: MedicationRequest["status"]
) {
  try {
    const docRef = doc(db, "medications", medicationId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error };
  }
}

// Update billing
export async function updateBillingStatus(
  medicationId: string,
  billed: boolean
) {
  try {
    const docRef = doc(db, "medications", medicationId);
    await updateDoc(docRef, {
      billed: billed,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating billing:", error);
    return { success: false, error };
  }
}

// Update medication details
export async function updateMedicationDetails(
  medicationId: string,
  updates: Partial<MedicationRequest>
) {
  try {
    const docRef = doc(db, "medications", medicationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating medication:", error);
    return { success: false, error };
  }
}

// Delete medication
export async function deleteMedication(medicationId: string) {
  try {
    const docRef = doc(db, "medications", medicationId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting medication:", error);
    return { success: false, error };
  }
}
