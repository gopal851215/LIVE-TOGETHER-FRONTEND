import { useState } from "react";
import api from "../api/axios";

const HostVerificationForm = ({ booking, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    guestName: booking?.guestId?.name || "",
    address: "",
    pinCode: "",
    aadharNumber: "",
    verificationPhoto: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      submitData.append("guestName", formData.guestName);
      submitData.append("address", formData.address);
      submitData.append("pinCode", formData.pinCode);
      submitData.append("aadharNumber", formData.aadharNumber);

      if (formData.verificationPhoto) {
        submitData.append("verificationPhoto", formData.verificationPhoto);
      }

      await api.put(`/bookings/${booking._id}/verify`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">
              Verify Guest Information
            </h2>

            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Guest Name
            </label>

            <input
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>

            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Pin Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pin Code
            </label>

            <input
              name="pinCode"
              type="number"
              value={formData.pinCode}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Aadhar */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Aadhar Number
            </label>

            <input
              name="aadharNumber"
              type="text"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Verification Photo
            </label>

            <input
              name="verificationPhoto"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Verification"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default HostVerificationForm;