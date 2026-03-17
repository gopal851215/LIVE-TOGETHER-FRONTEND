import { useEffect, useState } from "react";
import api from "../api/axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bookings");
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

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const resolveImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/120x80?text=No+Image";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${url.replace(/^\//, "")}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Bookings</h1>
      <p className="text-slate-600 mb-8">View all your booking requests, status, and guest info.</p>

      {loading ? (
        <div className="text-center text-slate-500 animate-pulse py-20">Loading bookings…</div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 text-red-700 text-center shadow-md">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-6 text-slate-600 text-center shadow-md">
          You have no bookings yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-2xl transition"
            >
              {/* Property Image */}
              <div className="w-full md:w-40 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={resolveImageUrl(booking.propertyId?.houseImage || booking.propertyId?.images?.[0])}
                  alt={booking.propertyId?.title || "Property"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Property & Guest Info */}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">{booking.propertyId?.title}</h2>
                <p className="text-sm text-slate-600">
                  {booking.seatsBooked > 1 && (
                    <p className="text-sm text-slate-600 font-medium">
                      Seats: <span className="font-semibold">{booking.seatsBooked}</span>
                    </p>
                  )}
                  Stay Duration: <span className="font-medium">{booking.stayDuration} month(s)</span>
                </p>
                <p className="text-sm text-slate-600">
                  Visit Date: <span className="font-medium">{new Date(booking.visitDate).toLocaleDateString()}</span>
                </p>

                {booking.professionalInfo && (
                  <div className="mt-2 flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 p-3 rounded-lg">
                    {booking.professionalInfo.passportPhoto && (
                      <img
                        src={resolveImageUrl(booking.professionalInfo.passportPhoto)}
                        alt="Passport"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="text-sm text-slate-700">
                      <p>Name: {booking.professionalInfo.name || "-"}</p>
                      <p>Profession: {booking.professionalInfo.profession || "-"}</p>
                      <p>Workplace: {booking.professionalInfo.workplace || "-"}</p>
                      <p>Age: {booking.professionalInfo.age || "-"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badges & Cancel */}
              <div className="flex flex-col gap-2 mt-4 md:mt-0 items-start md:items-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.bookingStatus === "accepted"
                      ? "bg-green-100 text-green-700"
                      : booking.bookingStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.bookingStatus}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.paymentStatus}
                </span>

                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="mt-2 rounded-md bg-red-500 px-3 py-1 text-white text-xs font-medium hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyBookings;