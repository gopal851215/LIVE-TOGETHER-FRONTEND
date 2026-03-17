import { useEffect, useState } from "react";
import api from "../../api/axios";
import HostVerificationForm from "../../components/HostVerificationForm";

const HostBookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bookings/host");
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [refreshKey]);

  const pendingBookings = bookings.filter((b) => b.bookingStatus === "pending");

const handleStatusUpdate = async (bookingId, status) => {
    if (!window.confirm(`Are you sure? ${status === 'accepted' ? 'Accept' : 'Reject'} this booking?`)) return;
    
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setRefreshKey(prev => prev + 1);
      if (status === 'accepted') {
        setSelectedBooking(bookings.find(b => b._id === bookingId));
        setShowVerification(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const openVerification = (booking) => {
    setSelectedBooking(booking);
    setShowVerification(true);
  };

  const resolveImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/120x80?text=No+Image";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${url.replace(/^\//, "")}`;
  };

  const getPerSeatPrice = (property) => {
    const allowedMembers = property.allowedMembers || 1;
    const fullRoomPrice = property.fullHousePrice || property.pricePerMonth || 0;
    return property.perSeatPrice || (allowedMembers > 0 ? Math.floor(fullRoomPrice / allowedMembers) : 0);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
          Loading booking requests…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        <button 
          onClick={fetchBookings}
          className="mt-3 px-4 py-2 border rounded-lg hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Booking Requests</h2>
        <p className="mt-2 text-sm text-slate-600">Pending booking requests from guests.</p>

        {pendingBookings.length === 0 ? (
          <div className="mt-6 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
            No pending booking requests.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {pendingBookings.map((b) => {
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
                        BHK: {b.propertyId?.bhkType || "-"} • Price: ₹{perSeatPrice.toLocaleString()} / seat / month
                      </p>
                      <p className="text-sm text-slate-600">Guest: {b.guestId?.name || "-"} ({b.guestId?.email || "-"})</p>
                      {b.guestId?.phone && <p className="text-sm text-slate-600">Phone: {b.guestId.phone}</p>}
                      {b.seatsBooked > 1 && (
                        <p className="text-sm text-slate-600 font-medium">Seats Booked: {b.seatsBooked}</p>
                      )}
                      <p className="text-sm text-slate-600">Duration: {b.stayDuration} month(s)</p>
                      <p className="text-sm text-slate-600">Visit: {new Date(b.visitDate).toLocaleDateString()}</p>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex flex-col items-start md:items-end gap-2 pt-2 md:pt-0">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        Pending
                      </span>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleStatusUpdate(b._id, 'rejected')}
                          className="px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(b._id, 'accepted')}
                          className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition"
                        >
                          Accept
                        </button>
                      </div>
                      <button
                        onClick={() => openVerification(b)}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-700 underline"
                      >
                        Verify Guest (after accept)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showVerification && selectedBooking && (
        <HostVerificationForm 
          booking={selectedBooking} 
          onSubmit={() => {
            setShowVerification(false);
            setRefreshKey(prev => prev + 1);
          }}
          onCancel={() => setShowVerification(false)}
        />
      )}
    </>
  );
};

export default HostBookingRequests;
