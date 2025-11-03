"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Loader2 } from "lucide-react";

type FormData = {
  name: string;
  enrolleeID: string;
  scheme: string;
  phone: string;
  diagnosis: string;
  medications: string;
  address: string;
  requestSource: "contactCenter" | "telemedicine";
  file: FileList;
};

const FormPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [date] = useState(() => new Date().toLocaleString());

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);

      // 👇 Mock upload logic (replace with Firebase / Zapier later)
      const file = data.file?.[0];
      let fileLink = "";

      if (file) {
        // simulate upload delay
        await new Promise((res) => setTimeout(res, 1500));
        fileLink = `https://fake-storage/${file.name}`;
      }

      const formDataToSave = {
        ...data,
        fileLink,
        status: "Not Sorted",
        dateCreated: date,
      };

      console.log("✅ Form Submitted:", formDataToSave);
      alert("Request submitted successfully!");

      reset();
      setFileName(null);
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Submit Request</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm"
      >
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          {/* Date (Auto-filled) */}
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="text"
              value={date}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full border rounded-lg p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Enrollee ID */}
          <div>
            <label className="block font-medium mb-1">Enrollee ID</label>
            <input
              type="text"
              {...register("enrolleeID", {
                required: "Enrollee ID is required",
              })}
              className="w-full border rounded-lg p-2"
            />
            {errors.enrolleeID && (
              <p className="text-red-500 text-sm">
                {errors.enrolleeID.message}
              </p>
            )}
          </div>

          {/* Scheme/Plan */}
          <div>
            <label className="block font-medium mb-1">Scheme/Plan</label>
            <input
              type="text"
              {...register("scheme", { required: "Scheme/Plan is required" })}
              className="w-full border rounded-lg p-2"
            />
            {errors.scheme && (
              <p className="text-red-500 text-sm">{errors.scheme.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Enter a valid number",
                },
              })}
              className="w-full border rounded-lg p-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">
          {/* Diagnosis */}
          <div>
            <label className="block font-medium mb-1">Diagnosis</label>
            <textarea
              {...register("diagnosis", { required: "Diagnosis is required" })}
              className="w-full border rounded-lg p-2 h-20"
            ></textarea>
            {errors.diagnosis && (
              <p className="text-red-500 text-sm">{errors.diagnosis.message}</p>
            )}
          </div>

          {/* Medications */}
          <div>
            <label className="block font-medium mb-1">Medications</label>
            <textarea
              {...register("medications", {
                required: "Medications are required",
              })}
              className="w-full border rounded-lg p-2 h-20"
            ></textarea>
            {errors.medications && (
              <p className="text-red-500 text-sm">
                {errors.medications.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-1">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="w-full border rounded-lg p-2 h-20"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Request Source */}
          <div>
            <label className="block font-medium mb-1">Request Source</label>
            <select
              {...register("requestSource", { required: true })}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Request type</option>
              <option value="contactCenter">Acute</option>
              <option value="telemedicine">Telemedicine</option>
            </select>
            {errors.requestSource && (
              <p className="text-red-500 text-sm">Select a request source</p>
            )}
          </div>

          {/* Upload Prescription */}
          <div>
            <label className="block font-medium mb-1">
              Upload Prescription
            </label>
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <Upload className="text-gray-400 mb-2" size={32} />
              <input
                type="file"
                accept="image/*,application/pdf"
                {...register("file")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFileName(file ? file.name : null);
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                Click to upload
              </label>
              {fileName && <p className="mt-2 text-gray-600">{fileName}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            disabled={uploading}
            className="bg-primary cursor-pointer text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Uploading...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
