// import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { db, storage } from "./config/firebase";

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// // Upload file to Firebase Storage
// export async function uploadFile(
//   file: File,
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   // Check file size
//   if (file.size > MAX_FILE_SIZE) {
//     throw new Error("File too large (max 10MB)");
//   }

//   // Check file type
//   if (!ALLOWED_TYPES.includes(file.type)) {
//     throw new Error("Only JPG, PNG, and PDF allowed");
//   }

//   // Create unique filename
//   const timestamp = Date.now();
//   const fileName = `prescriptions/${timestamp}_${file.name}`;
//   const storageRef = ref(storage, fileName);

//   // Upload file
//   const uploadTask = uploadBytesResumable(storageRef, file);

//   return new Promise((resolve, reject) => {
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         if (onProgress) onProgress(progress);
//       },
//       (error) => reject(error),
//       async () => {
//         const url = await getDownloadURL(uploadTask.snapshot.ref);
//         resolve(url);
//       }
//     );
//   });
// }

// // Submit form to Firestore
// export async function submitRequest(data: any, fileUrl: string | null) {
//   try {
//     const docRef = await addDoc(collection(db, "medications"), {
//       name: data.name,
//       enrolleeId: data.enrolleeID,
//       scheme: data.scheme,
//       phone: data.phone,
//       address: data.address,
//       diagnosis: data.diagnosis || "",
//       medications: data.medications || "",
//       source: data.requestSource === "contactCenter" ? "Acute" : "Telemedicine",
//       fileUrl: fileUrl || "",
//       status: "Not Sorted",
//       billed: false,
//       billingAmount: 0,
//       date: new Date().toISOString().split("T")[0],
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return { success: true, id: docRef.id };
//   } catch (error) {
//     console.error("Error:", error);
//     return { success: false, error: "Failed to submit" };
//   }
// }

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config/firebase";

// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { db, storage } from "./config/firebase";

// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_TYPES = [
//   "image/jpeg",
//   "image/png",
//   "image/jpg",
//   "application/pdf",
// ];

// Upload file to Firebase Storage
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // ⚠️ TEMPORARY FIX: Skip upload if Storage not configured
  // Remove this block once Storage is working
  console.warn("⚠️ Storage not fully configured yet");
  console.log("📎 File selected but not uploaded:", file.name);
  if (onProgress) onProgress(100);
  return "STORAGE_NOT_CONFIGURED"; // Placeholder URL

  // TODO: Uncomment below once Storage is working
  /*
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 10MB)');
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, and PDF allowed');
  }

  // Create unique filename
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `prescriptions/${timestamp}_${sanitizedFileName}`;
  const storageRef = ref(storage, fileName);
  
  // Upload file
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(new Error('Failed to get download URL'));
        }
      }
    );
  });
  */
}

// Submit form to Firestore
export async function submitRequest(data: any, fileUrl: string | null) {
  try {
    console.log("💾 Submitting to Firestore...");
    console.log("   Collection: medications");
    console.log("   Data:", {
      name: data.name,
      enrolleeId: data.enrolleeID,
      fileUrl: fileUrl,
    });

    const docRef = await addDoc(collection(db, "medications"), {
      // Patient Info
      name: data.name,
      enrolleeId: data.enrolleeID,
      scheme: data.scheme,
      phone: data.phone,
      address: data.address,

      // Medical Info
      diagnosis: data.diagnosis || "",
      medications: data.medications || "",

      // Request Info
      source: data.requestSource === "contactCenter" ? "Acute" : "Telemedicine",
      fileUrl: fileUrl || "",

      // Status & Metadata
      status: "Not Sorted",
      billed: false,
      billingAmount: 0,

      // Timestamps
      date: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Document created with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Firestore error:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("   Error name:", error.name);
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit",
    };
  }
}
