import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const HostManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/properties/host");
      setListings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      if (status === 403) {
        setError("You are not authorized to delete this listing. Please log in as the host who owns this property.");
      } else if (status === 404) {
        setError("Property not found or already deleted.");
      } else {
        setError(serverMessage || err.message);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Manage Listings</h2>
      <p className="mt-2 text-sm text-slate-600">Update or remove your active property listings.</p>

      {loading ? (
        <div className="mt-6 text-sm text-slate-500">Loading your listings…</div>
      ) : error ? (
        <div className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : listings.length === 0 ? (
        <div className="mt-6 rounded-md bg-slate-50 p-3 text-sm text-slate-600">No listings yet. Add one from the sidebar.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {listings.map((listing) => {
            const imageSource = listing.houseImage || listing.indoorImages?.[0] || listing.outdoorImages?.[0] || listing.images?.[0];
            const imageUrl = imageSource
              ? imageSource.startsWith("http")
                ? imageSource
                : `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${imageSource.replace(/^\//, "")}`
              : null;
            return (
              <div key={listing._id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-24 rounded-lg bg-slate-100">
                    {imageUrl ? (
                      <img src={imageUrl} alt={listing.title} className="h-full w-full rounded-lg object-cover" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src='https://via.placeholder.com/120x80?text=No+Image'; }} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{listing.title}</h3>
                    <p className="text-sm text-slate-600">{listing.city} • {listing.type}</p>
                    <p className="mt-1 text-sm text-slate-500">Seats: {listing.availableSeats}/{listing.allowedMembers}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit/${listing._id}`)}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteListing(listing._id)}
                    className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HostManageListings;
