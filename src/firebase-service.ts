import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config/firebase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// Upload file to Firebase Storage
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large (max 10MB)");
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and PDF allowed");
  }

  // Create unique filename
  const timestamp = Date.now();
  const fileName = `prescriptions/${timestamp}_${file.name}`;
  const storageRef = ref(storage, fileName);

  // Upload file
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// Submit form to Firestore
export async function submitRequest(data: any, fileUrl: string | null) {
  try {
    const docRef = await addDoc(collection(db, "medications"), {
      name: data.name,
      enrolleeId: data.enrolleeID,
      scheme: data.scheme,
      phone: data.phone,
      address: data.address,
      diagnosis: data.diagnosis || "",
      medications: data.medications || "",
      source: data.requestSource === "contactCenter" ? "Acute" : "Telemedicine",
      fileUrl: fileUrl || "",
      status: "Not Sorted",
      billed: false,
      billingAmount: 0,
      date: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Failed to submit" };
  }
}
