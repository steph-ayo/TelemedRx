"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Upload,
  Loader2,
  FileText,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  Stethoscope,
  Pill,
  Calendar,
} from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        setFileName(file.name);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.files = dataTransfer.files;
        }
      } else {
        alert("Please upload an image or PDF file");
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);

      const file = data.file?.[0];
      let fileBase64 = "";
      let fileName = "";

      if (file) {
        const reader = new FileReader();
        fileBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () =>
            resolve(reader.result?.toString().split(",")[1] || "");
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileName = file.name;
      }

      const payload = {
        ...data,
        fileBase64,
        fileName,
        date,
        updatedBy: "Contact Center Agent",
      };

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbweb4lKeBPRPSJ4rvgatwDelnXEKxg0Fq7H2RADbmH1fcqqZnbPb4A1msPyJ400WujCkA/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          reset();
          setFileName(null);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        alert("❌ Failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Medical Request Form
          </h1>
          <p className="text-gray-600">
            Please fill in all required information
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="text-green-800 font-semibold">
                Request submitted successfully!
              </p>
              <p className="text-green-600 text-sm">
                Your form has been processed
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Patient Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Patient Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} />
                  Date & Time
                </label>
                <input
                  type="text"
                  value={date}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-600"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-transparent transition"
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
                  {...register("enrolleeID", {
                    required: "Enrollee ID is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-transparent transition"
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
                  {...register("scheme", {
                    required: "Scheme/Plan is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-transparent transition"
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
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Enter a valid number",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-transparent transition"
                  placeholder="Enter phone number"
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
                  {...register("address", { required: "Address is required" })}
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:border-transparent transition resize-none"
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

          {/* Medical Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
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
                  className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:border-transparent transition resize-none"
                  placeholder="Enter diagnosis details"
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
                  className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:border-transparent transition resize-none"
                  placeholder="List medications"
                ></textarea>
              </div>

              {/* Request Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("requestSource", { required: true })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-transparent transition bg-white"
                >
                  <option value="">Select request type</option>
                  <option value="contactCenter">Acute</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
                {errors.requestSource && (
                  <p className="text-red-500 text-sm mt-1">
                    Select a request type
                  </p>
                )}
              </div>

              {/* Upload Prescription */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} />
                  Upload Prescription
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all h-28 cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-gray-300 hover:border-primary hover:bg-primary/10"
                  }`}
                >
                  <Upload
                    className={`mb-2 transition-colors ${
                      isDragging ? "text-primary" : "text-gray-400"
                    }`}
                    size={28}
                  />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    {...register("file")}
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-sm text-primary cursor-pointer hover:underline font-medium"
                  >
                    {fileName ? fileName : "Click or drag to upload"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG or PDF (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pb-8">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={uploading}
              className="bg-primary text-white font-semibold px-12 py-4 rounded-xl flex items-center gap-3 cursor-pointer transform transition 300"
            >
              {uploading ? (
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
        </div>
      </div>
    </div>
  );
};

export default FormPage;
