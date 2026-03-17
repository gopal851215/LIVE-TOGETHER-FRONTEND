import { useEffect, useState } from "react";
import api from "../../api/axios";
import ReceiptModal from "../../components/ReceiptModal";

const HostConfirmedBookings = () => {
  const [bookings, setBookings] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
const res = await api.get("/bookings/host");
      // Ensure property pricing fields are populated (backend now handles this)
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmed = bookings.filter((b) => b.bookingStatus === "accepted");

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${url.replace(/^\//, "")}`;
  };

  // Robust per-seat price calculation like ReceiptModal
  const getPerSeatPrice = (property) => {
    const allowedMembers = property.allowedMembers || 1;
    const fullRoomPrice = property.fullHousePrice || property.pricePerMonth || 0;
    return property.perSeatPrice || (allowedMembers > 0 ? Math.floor(fullRoomPrice / allowedMembers) : 0);
  };

  const openReceipt = (booking) => {
    setSelectedBooking(booking);
    setShowReceiptModal(true);
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Confirmed Bookings</h2>
        <p className="mt-2 text-sm text-slate-600">Bookings you have accepted from guests.</p>

        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
            Loading confirmed bookings…
          </div>
        ) : error ? (
          <div className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : confirmed.length === 0 ? (
          <div className="mt-6 rounded-md bg-slate-50 p-3 text-sm text-slate-600">No confirmed bookings yet.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {confirmed.map((b) => {
              const perSeatPrice = getPerSeatPrice(b.propertyId || {});
              return (
                <div
                  key={b._id}
                  className="rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    {/* Left Section: Property & Guest Info */}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{b.propertyId?.title}</p>
                      <p className="text-sm text-slate-600">
                        BHK: {b.propertyId?.bhkType || "-"} • Price: ₹{perSeatPrice.toLocaleString()} / seat / month • Allowed Members: {b.propertyId?.allowedMembers || 1}
                      </p>
                      <p className="text-sm text-slate-600">Guest: {b.guestId?.name || "-"} ({b.guestId?.email || "-"})</p>
                      {b.guestId?.phone && <p className="text-sm text-slate-600">Phone: {b.guestId.phone}</p>}
                      {b.seatsBooked > 1 && (
                        <p className="text-sm text-slate-600 font-medium">Seats Booked: {b.seatsBooked}</p>
                      )}
                      <p className="text-sm text-slate-600">Stay Duration: {b.stayDuration} month(s)</p>
                      <p className="text-sm text-slate-600">Visit Date: {new Date(b.visitDate).toLocaleDateString()}</p>

                      {/* Professional Info */}
                      {b.professionalInfo && (
                        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
                          <p>Profession: {b.professionalInfo.profession || "-"}</p>
                          <p>Workplace: {b.professionalInfo.workplace || "-"}</p>
                          <p>Age: {b.professionalInfo.age || "-"}</p>
                          {b.professionalInfo.passportPhoto && (
                            <img
                              src={resolveImageUrl(b.professionalInfo.passportPhoto)}
                              alt="Passport"
                              className="mt-2 h-16 w-16 rounded-md object-cover border"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Section: Status & Actions */}
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Confirmed
                      </span>
                      <button
                        onClick={() => openReceipt(b)}
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                      >
                        View Receipt
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReceiptModal 
        booking={selectedBooking} 
        isOpen={showReceiptModal} 
        onClose={() => setShowReceiptModal(false)} 
      />
    </>
  );
};

export default HostConfirmedBookings;