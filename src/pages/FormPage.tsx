"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  Stethoscope,
  Pill,
  AlertCircle,
} from "lucide-react";

// Import our files
import {
  medicationRequestSchema,
  type MedicationRequestFormData,
} from "../validation";
import { uploadFile, submitRequest } from "../firebase-service";

const FormPage = () => {
  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MedicationRequestFormData>({
    resolver: zodResolver(medicationRequestSchema),
  });

  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for success/error messages
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "File must be less than 10MB" });
        return;
      }

      // Check file type
      const allowed = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowed.includes(file.type)) {
        setMessage({ type: "error", text: "Only JPG, PNG, and PDF allowed" });
        return;
      }

      setSelectedFile(file);
      setMessage({ type: null, text: "" });
    }
  };

  // Form submission
  const onSubmit = async (data: MedicationRequestFormData) => {
    try {
      setMessage({ type: null, text: "" });
      let fileUrl: string | null = null;

      // Upload file if selected
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile, setUploadProgress);
      }

      // Submit to Firestore
      const result = await submitRequest(data, fileUrl);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Request submitted successfully!",
        });

        // Reset form after 2 seconds
        setTimeout(() => {
          reset();
          setSelectedFile(null);
          setUploadProgress(0);
          setMessage({ type: null, text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: "Failed to submit request" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong!" });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Medication Request Form
          </h1>
          <p className="text-gray-600">Fill in all required information</p>
        </div>

        {/* Success/Error Message */}
        {message.type && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <p
              className={`font-semibold ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Patient Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-lg p-3 "
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Enrollee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("enrolleeID")}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Enter enrollee ID"
                />
                {errors.enrolleeID && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.enrolleeID.message}
                  </p>
                )}
              </div>

              {/* Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheme/Plan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("scheme")}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Enter scheme or plan"
                />
                {errors.scheme && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.scheme.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="08012345678"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} />
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("address")}
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none"
                  placeholder="Enter full address"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Medical Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <textarea
                  {...register("diagnosis")}
                  className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none"
                  placeholder="Enter diagnosis"
                ></textarea>
              </div>

              {/* Medications */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Pill size={16} />
                  Medications
                </label>
                <textarea
                  {...register("medications")}
                  className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none"
                  placeholder="List medications"
                ></textarea>
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("requestSource")}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <option value="">Select type</option>
                  <option value="contactCenter">Acute</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
                {errors.requestSource && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requestSource.message}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Prescription
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <Upload className="mx-auto mb-2 text-gray-400" size={28} />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-sm text-blue-600 cursor-pointer hover:underline font-medium"
                  >
                    {selectedFile ? selectedFile.name : "Click to upload"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG or PDF (Max 10MB)
                  </p>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      {uploadProgress.toFixed(0)}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pb-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-12 py-4 rounded-xl flex items-center gap-3 transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormPage;
