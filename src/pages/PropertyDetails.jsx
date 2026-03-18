import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingType, setBookingType] = useState("fullRoom");
  const [seatCount, setSeatCount] = useState(1);
  const [members, setMembers] = useState([
    { profession: "", workplace: "", age: "", passportPhoto: "" },
  ]);

  const [visitDate, setVisitDate] = useState("");
  const [stayDuration, setStayDuration] = useState(1);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleSeatChange = (count) => {
    setSeatCount(count);

    const updatedMembers = Array.from({ length: count }, () => ({
      profession: "",
      workplace: "",
      age: "",
      passportPhoto: "",
    }));

    setMembers(updatedMembers);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/bookings", {
        propertyId: id,
        bookingType,
        seatCount,
        stayDuration: Number(stayDuration),
        visitDate,
        members,
      });

      setMessage("Booking request submitted successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-slate-500">
        Loading property...
      </div>
    );

  if (error)
    return <div className="p-6 text-center text-red-600">{error}</div>;

  if (!property) return null;

  const totalPrice =
    bookingType === "seat"
      ? property.perSeatPrice * seatCount * Number(stayDuration || 1)
      : property.fullHousePrice * Number(stayDuration || 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-3">

        {/* PROPERTY DETAILS */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white shadow-sm">

            {/* MAIN IMAGE */}
            <div className="p-4">
              {property.houseImage ? (
                <img
                  src={property.houseImage}   // ✅ FIXED
                  alt="House"
                  className="h-80 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center text-slate-400">
                  No main image
                </div>
              )}
            </div>

            {/* GALLERY */}
            <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
              {[...(property.indoorImages || []), ...(property.outdoorImages || [])]
                .length > 0 ? (
                [...(property.indoorImages || []), ...(property.outdoorImages || [])].map(
                  (img, index) => (
                    <img
                      key={index}
                      src={img}   // ✅ FIXED
                      alt="Property"
                      className="h-44 w-full rounded-xl object-cover"
                    />
                  )
                )
              ) : (
                <div className="text-slate-400 text-center col-span-2">
                  No images available
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-6">
              <h1 className="text-2xl font-semibold">{property.title}</h1>

              <div className="mt-2 flex gap-2 text-sm">
                <span className="bg-slate-100 px-2 py-1 rounded">
                  {property.type}
                </span>
                <span className="bg-slate-100 px-2 py-1 rounded">
                  {property.bhkType}
                </span>
                <span className="bg-slate-100 px-2 py-1 rounded">
                  {property.city}
                </span>
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-sm">Price / month</p>
                  <p className="text-xl font-semibold">
                    ₹{property.pricePerMonth}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-sm">Available seats</p>
                  <p className="text-xl font-semibold">
                    {property.availableSeats}
                  </p>
                </div>
              </div>

              <div className="mt-6 text-sm space-y-2">
                <p>
                  <strong>Location:</strong> {property.location} •{" "}
                  {property.nearbyPlace} • {property.distance}
                </p>

                <p>
                  <strong>Stay:</strong> {property.minimumStay} -{" "}
                  {property.maximumStay} months
                </p>

                <p>
                  <strong>Allowed members:</strong> {property.allowedMembers}
                </p>
              </div>

              {/* RULES */}
              {property.rules && (
                <div className="mt-6 border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Rules</h3>
                  <p className="text-sm whitespace-pre-line">
                    {property.rules}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOOKING FORM */}
        <aside>
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold">Book this property</h2>

            {message && (
              <div className="text-green-600 text-sm mt-2">{message}</div>
            )}

            <form onSubmit={handleBooking} className="mt-4 space-y-4">

              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="fullRoom">Full Room</option>
                <option value="seat">Single Seat</option>
              </select>

              {bookingType === "seat" && (
                <select
                  value={seatCount}
                  onChange={(e) =>
                    handleSeatChange(Number(e.target.value))
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  {Array.from(
                    { length: property.availableSeats || 1 },
                    (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} Seat
                      </option>
                    )
                  )}
                </select>
              )}

              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="number"
                value={stayDuration}
                onChange={(e) => setStayDuration(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <div className="bg-slate-100 p-3 rounded text-sm">
                <p className="font-bold text-lg">Total: ₹{totalPrice}</p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Request Booking
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default PropertyDetails;