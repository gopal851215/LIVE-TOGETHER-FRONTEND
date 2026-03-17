
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const HostAddProperty = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("room");
  const [internMode, setInternMode] = useState("room"); // intern stays can be room-style or flat-style
  const [form, setForm] = useState({
    title: "",
    type: "room",
    bhkType: "1BHK",
    allowedMembers: 1,
    ownerName: "",
    ownerEmail: "",
    allowedFor: "anyone", // ✅ Added
    perSeatPrice: 0,
    fullHousePrice: 0,
    minimumStay: 1,
    maximumStay: 3,
    city: "",
    location: "",
    nearbyPlace: "",
    distance: "",
    internStyle: "room",
    kitchen: "shared",
    bathroom: "shared",
    toilet: "shared",
    electricityFree: "yes",
    waterFree: "yes",
    rules: ""
  });

  const [houseImage, setHouseImage] = useState(null);
  const [indoorImages, setIndoorImages] = useState([]);
  const [outdoorImages, setOutdoorImages] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (!isEditMode) return;
      setFetching(true);
      try {
        const res = await api.get(`/properties/${id}`);
        const p = res.data;
        setForm({
          title: p.title || "",
          type: p.type || "room",
          bhkType: p.bhkType || "1BHK",
          allowedMembers: p.allowedMembers || 1,
          ownerName: p.ownerName || "",
          ownerEmail: p.ownerEmail || "",
          allowedFor: p.allowedFor || "anyone", // ✅ Added
          perSeatPrice: p.perSeatPrice || 0,
          fullHousePrice: p.fullHousePrice || 0,
          minimumStay: p.minimumStay || 1,
          maximumStay: p.maximumStay || 3,
          city: p.city || "",
          location: p.location || "",
          nearbyPlace: p.nearbyPlace || "",
          distance: p.distance || "",
          internStyle: p.internStyle || "room",
          kitchen: p.kitchen || "shared",
          bathroom: p.bathroom || "shared",
          toilet: p.toilet || "shared",
          electricityFree: p.electricityFree || "yes",
          waterFree: p.waterFree || "yes",
          rules: p.rules || ""
        });
        setActiveTab(p.type || "room");
        setInternMode(p.type === "intern" ? (p.internStyle || "room") : "room");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setFetching(false);
      }
    };
    loadProperty();
  }, [id, isEditMode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleHouseImageChange = (e) => {
    setHouseImage(e.target.files[0] || null);
  };

  const handleIndoorImagesChange = (e) => {
    setIndoorImages(Array.from(e.target.files));
  };

  const handleOutdoorImagesChange = (e) => {
    setOutdoorImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("bhkType", form.bhkType);
      formData.append("allowedMembers", Number(form.allowedMembers));
      formData.append("ownerName", form.ownerName);
      formData.append("ownerEmail", form.ownerEmail);
      formData.append("allowedFor", form.allowedFor); // ✅ Added
      formData.append("perSeatPrice", Number(form.perSeatPrice));
      formData.append("fullHousePrice", Number(form.fullHousePrice));
      formData.append("minimumStay", Number(form.minimumStay));
      formData.append("maximumStay", Number(form.maximumStay));
      formData.append("city", form.city);
      formData.append("location", form.location);
      formData.append("nearbyPlace", form.nearbyPlace);
      formData.append("distance", form.distance);
      formData.append("kitchen", form.kitchen);
      formData.append("bathroom", form.bathroom);
      formData.append("toilet", form.toilet);
      formData.append("electricityFree", form.electricityFree);
      formData.append("waterFree", form.waterFree);
      formData.append("rules", form.rules);

      if (form.type === "intern") {
        formData.append("internStyle", form.internStyle || "room");
      }
      if (houseImage) formData.append("houseImage", houseImage);
      indoorImages.forEach((file) => formData.append("indoorImages", file));
      outdoorImages.forEach((file) => formData.append("outdoorImages", file));

      if (isEditMode) {
        await api.put(`/properties/${id}`, formData);
        setStatus("Property updated successfully.");
      } else {
        await api.post("/properties", formData);
        setStatus("Property created successfully.");
      }

      // Reset form
      setHouseImage(null);
      setIndoorImages([]);
      setOutdoorImages([]);
      setForm({
        title: "",
        type: form.type,
        bhkType: "1BHK",
        allowedMembers: 1,
        allowedFor: "anyone", // ✅ Reset
        pricePerMonth: 0,
        minimumStay: 1,
        maximumStay: 3,
        city: "",
        location: "",
        nearbyPlace: "",
        distance: "",
        internStyle: form.internStyle || "room",
        kitchen: "shared",
        bathroom: "shared",
        toilet: "shared",
        electricityFree: "yes",
        waterFree: "yes",
        rules: "",
        perSeatPrice:0,
        fullHousePrice:0
      });

      if (isEditMode) {
        navigate("/dashboard/listings");
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{isEditMode ? "Edit listing" : "Add a new listing"}</h2>
      <p className="mt-2 text-sm text-slate-600">{isEditMode ? "Update the property details." : "Create a room, flat or intern stay for guests to book."}</p>

      {status && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{status}</div>}
      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { id: "room", label: "Room" },
          { id: "flat", label: "Flat" },
          { id: "intern", label: "Intern" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${activeTab === tab.id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            onClick={() => {
              setActiveTab(tab.id);
              setForm((prev) => ({
                ...prev,
                type: tab.id,
                bhkType: tab.id === "room" ? "1BHK" : prev.bhkType,
                allowedMembers: tab.id === "room" ? 1 : prev.allowedMembers,
                internStyle: tab.id === "intern" ? (prev.internStyle || "room") : prev.internStyle
              }));
              if (tab.id === "intern") setInternMode("room");
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "intern" && (
        <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium">Intern stay style</p>
          <div className="mt-2 flex gap-2">
            {[
              { id: "room", label: "Room-style" },
              { id: "flat", label: "Flat-style" }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`rounded-lg px-3 py-2 text-sm font-medium ${internMode === opt.id ? "bg-brand-600 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}
                onClick={() => {
                  setInternMode(opt.id);
                  setForm((prev) => ({
                    ...prev,
                    bhkType: opt.id === "room" ? "1BHK" : prev.bhkType,
                    internStyle: opt.id
                  }));
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Title, Type */}
<div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Owner Name *</span>
            <input
              value={form.ownerName}
              onChange={handleChange("ownerName")}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Owner Email *</span>
            <input
              value={form.ownerEmail}
              type="email"
              onChange={handleChange("ownerEmail")}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              value={form.title}
              onChange={handleChange("title")}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <input
              value={form.type}
              readOnly
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </label>
        </div>

        {/* BHK Type, Allowed Members, Allowed For */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">BHK Type</span>
            <select
              value={form.bhkType}
              onChange={handleChange("bhkType")}
              disabled={form.type === "room" || (form.type === "intern" && internMode === "room")}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
            </select>
            {(form.type === "room" || (form.type === "intern" && internMode === "room")) && (
              <p className="text-xs text-slate-500 mt-1">Rooms are single-occupancy; BHK type is not used.</p>
            )}
          </label>
<label className="block">
<span className="text-sm font-medium text-slate-700">
Per Seat Price per Month (₹)
</span>

<input
type="number"
value={form.perSeatPrice}
onChange={handleChange("perSeatPrice")}
className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
/>

</label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Allowed members</span>
            <input
              value={form.allowedMembers}
              onChange={handleChange("allowedMembers")}
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Allowed For</span>
            <select
              value={form.allowedFor}
              onChange={handleChange("allowedFor")}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="anyone">Anyone</option>
              <option value="boys">Boys Only</option>
              <option value="girls">Girls Only</option>
              <option value="family">Family</option>
            </select>
          </label>
        </div>

        {/* Price, Minimum & Maximum Stay */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700"> full Price  (₹)</span>
            <input
              value={form.pricePerMonth}
              onChange={handleChange("pricePerMonth")}
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Minimum stay (months)</span>
            <input
              value={form.minimumStay}
              onChange={handleChange("minimumStay")}
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Maximum stay (months)</span>
            <input
              value={form.maximumStay}
              onChange={handleChange("maximumStay")}
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">City</span>
            <input
              value={form.city}
              onChange={handleChange("city")}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>

        {/* Location, Nearby */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <input
              value={form.location}
              onChange={handleChange("location")}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nearby / landmark</span>
            <input
              value={form.nearbyPlace}
              onChange={handleChange("nearbyPlace")}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>

        {/* Distance & Rules */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Distance (e.g., to campus)</span>
            <input
              value={form.distance}
              onChange={handleChange("distance")}
              placeholder="5 mins walk"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <div className="border rounded-lg p-4 space-y-2">
            <label className="text-sm font-semibold text-slate-800">Rules & Regulations</label>
            <textarea
              rows={5}
              value={form.rules}
              onChange={handleChange("rules")}
              placeholder="Example: No smoking, No loud music after 10 PM..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* House Facilities */}
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <h3 className="text-md font-semibold text-slate-800">House Facilities</h3>
          {["kitchen","bathroom","toilet","electricityFree","waterFree"].map((field) => (
            <div key={field} className="flex items-center justify-between">
              <span className="text-sm text-slate-700">{field.charAt(0).toUpperCase() + field.slice(1).replace("Free","")}</span>
              <select
                value={form[field]}
                onChange={handleChange(field)}
                className="border border-slate-200 rounded-lg px-3 py-1"
              >
                {field === "kitchen" || field === "bathroom" || field === "toilet" ? (
                  <>
                    <option value="shared">Shared</option>
                    <option value="private">Separate</option>
                    <option value="no">Not Available</option>
                  </>
                ) : (
                  <>
                    <option value="yes">Free</option>
                    <option value="no">Extra Charges</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>

        {/* Images */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">House image</span>
          <input type="file" accept="image/*" onChange={handleHouseImageChange} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Indoor images</span>
          <input type="file" accept="image/*" multiple onChange={handleIndoorImagesChange} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
          <p className="text-xs text-slate-500">Upload 0-6 indoor photos.</p>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Outdoor images</span>
          <input type="file" accept="image/*" multiple onChange={handleOutdoorImagesChange} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
          <p className="text-xs text-slate-500">Upload 0-6 outdoor photos.</p>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create listing"}
        </button>
      </form>
    </div>
  );
};

export default HostAddProperty;