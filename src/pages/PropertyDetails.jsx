// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";

// const PropertyDetails = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bookingType, setBookingType] = useState("fullRoom");
//   const [visitDate, setVisitDate] = useState("");
//   const [stayDuration, setStayDuration] = useState(1);
//   const [profession, setProfession] = useState("");
//   const [workplace, setWorkplace] = useState("");
//   const [age, setAge] = useState(18);
//   const [passportPhoto, setPassportPhoto] = useState("");
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     const loadProperty = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await api.get(`/properties/${id}`);
//         setProperty(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProperty();
//   }, [id]);

//   const handleBooking = async (e) => {
//     e.preventDefault();
//     setMessage(null);
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     try {
//       await api.post("/bookings", {
//         propertyId: id,
//         bookingType,
//         stayDuration: Number(stayDuration),
//         visitDate,
//         profession,
//         workplace,
//         age: Number(age),
//         passportPhoto,
//       });
//       setMessage("Booking request submitted. Check your bookings page for status.");
//     } catch (err) {
//       setMessage(err.response?.data?.message || err.message);
//     }
//   };

//   if (loading) return <div className="p-6 text-center text-slate-500">Loading property…</div>;
//   if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
//   if (!property) return null;

//   const isIntern = property.type === "intern";

//   return (
//     <main className="mx-auto max-w-6xl px-4 py-10">
//       <div className="grid gap-10 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="p-4">
//               {property.houseImage ? (
//                 <img
//                   src={property.houseImage.startsWith("http") ? property.houseImage : `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${property.houseImage.replace(/^\//, "")}`}
//                   alt="House"
//                   className="h-80 w-full rounded-xl object-cover"
//                   onError={(e) => {
//                     e.currentTarget.onerror = null;
//                     e.currentTarget.src = "https://via.placeholder.com/900x400?text=No+image";
//                   }}
//                 />
//               ) : (
//                 <div className="flex h-80 items-center justify-center text-slate-400">No main house image</div>
//               )}
//             </div>
//             <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
//               { (property.indoorImages && property.indoorImages.length > 0) || (property.outdoorImages && property.outdoorImages.length > 0) ? (
//                 <>
//                   {property.indoorImages?.map((img) => {
//                     const src = img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${img.replace(/^\//, "")}`;
//                     return (
//                       <img
//                         key={img}
//                         src={src}
//                         alt="Indoor"
//                         className="h-44 w-full rounded-xl object-cover"
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.src = "https://via.placeholder.com/600x350?text=No+image";
//                         }}
//                       />
//                     );
//                   })}
//                   {property.outdoorImages?.map((img) => {
//                     const src = img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${img.replace(/^\//, "")}`;
//                     return (
//                       <img
//                         key={img}
//                         src={src}
//                         alt="Outdoor"
//                         className="h-44 w-full rounded-xl object-cover"
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.src = "https://via.placeholder.com/600x350?text=No+image";
//                         }}
//                       />
//                     );
//                   })}
//                 </>
//               ) : (
//                 <div className="flex h-56 items-center justify-center text-slate-400">No indoor/outdoor images</div>
//               )}
//             </div>

//             <div className="p-6">
//               <h1 className="text-2xl font-semibold text-slate-900">{property.title}</h1>
//               <div className="mt-2 flex flex-wrap gap-2 text-sm">
//                 <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{property.type}</span>
//                 <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{property.bhkType}</span>
//                 <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{property.city}</span>
//               </div>

//               <div className="mt-5 grid gap-4 md:grid-cols-2">
//                 <div className="rounded-2xl bg-slate-50 p-4">
//                   <h3 className="text-sm font-medium text-slate-700">Price per month</h3>
//                   <p className="mt-1 text-xl font-semibold text-slate-900">₹{property.pricePerMonth}</p>
//                 </div>
//                 <div className="rounded-2xl bg-slate-50 p-4">
//                   <h3 className="text-sm font-medium text-slate-700">Availability</h3>
//                   <p className="mt-1 text-xl font-semibold text-slate-900">{property.availableSeats} seats left</p>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-2 text-sm text-slate-600">

//  <p>
//     <strong>Location:</strong> {property.location} • {property.nearbyPlace} • {property.distance}
//   </p>

//   <p>
//     <strong>Stay:</strong> {property.minimumStay} - {property.maximumStay} month
//   </p>

//   <p>
//     <strong>Allowed members:</strong> {property.allowedMembers}
//   </p>

// <div className="border rounded-lg p-4 space-y-2">
//   <h3 className="font-semibold text-lg">House Facilities</h3>

//   <p>Kitchen: {property.kitchen}</p>
//   <p>Bathroom: {property.bathroom}</p>
//   <p>Toilet: {property.toilet}</p>
//   <p>
//     Electricity: {property.electricityFree === "yes" ? "Free" : "Extra Charges"}
//   </p>
//   <p>
//     Water: {property.waterFree === "yes" ? "Free" : "Extra Charges"}
//   </p>
// </div>

// {/* Rules & Regulations */}
// {property?.rules && property.rules.trim() !== "" && (
//   <div className="rounded-2xl border border-slate-200 bg-white p-4">
//     <h3 className="text-lg font-semibold text-slate-900 mb-2">
//       Rules & Regulations
//     </h3>

//     <p className="text-sm text-slate-600 whitespace-pre-line">
//       {property.rules}
//     </p>
//   </div>
// )}

                
//                 <p>
//                   <strong>Location:</strong> {property.location} • {property.nearbyPlace} • {property.distance}
//                 </p>
//                 <p>
//                   <strong>Stay:</strong> {property.minimumStay} - {property.maximumStay} month{property.maximumStay > 1 ? "s" : ""}
//                 </p>
//                 <p>
//                   <strong>Allowed members:</strong> {property.allowedMembers}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <aside className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-slate-900">Book this property</h2>
//             <p className="mt-2 text-sm text-slate-600">Choose a booking type and request a visit date.</p>
//             {message && (
//               <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>
//             )}
//             <form onSubmit={handleBooking} className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Booking type</label>
//                 <select
//                   value={bookingType}
//                   onChange={(e) => setBookingType(e.target.value)}
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
//                 >
//                   <option value="fullRoom">Full room</option>
//                   <option value="seat">Single seat</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Visit date</label>
//                 <input
//                   value={visitDate}
//                   onChange={(e) => setVisitDate(e.target.value)}
//                   type="date"
//                   required
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Stay duration (months)</label>
//                 <input
//                   value={stayDuration}
//                   onChange={(e) => setStayDuration(e.target.value)}
//                   type="number"
//                   min={property.minimumStay}
//                   max={property.maximumStay}
//                   required
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
//                 />
//                 {isIntern && (
//                   <p className="text-xs text-slate-500">Intern rooms must be booked for 1–3 months.</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Profession</label>
//                 <input
//                   value={profession}
//                   onChange={(e) => setProfession(e.target.value)}
//                   required
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Workplace</label>
//                 <input
//                   value={workplace}
//                   onChange={(e) => setWorkplace(e.target.value)}
//                   required
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Age</label>
//                 <input
//                   value={age}
//                   onChange={(e) => setAge(e.target.value)}
//                   type="number"
//                   min={16}
//                   required
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-slate-700">Passport photo</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (!file) {
//                       setPassportPhoto("");
//                       return;
//                     }
//                     const reader = new FileReader();
//                     reader.onload = () => setPassportPhoto(reader.result || "");
//                     reader.readAsDataURL(file);
//                   }}
//                   className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
//               >
//                 Request booking
//               </button>
//             </form>
//           </div>
//         </aside>
//       </div>
//     </main>
//   );
// };

// export default PropertyDetails;



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
    return <div className="p-6 text-center text-slate-500">Loading property...</div>;

  if (error)
    return <div className="p-6 text-center text-red-600">{error}</div>;

  if (!property) return null;

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, "");

const getImage = (img) => {
  if (!img) return "";

  // ✅ Cloudinary OR already full URL
  if (img.startsWith("http")) return img;

  // ✅ Local uploaded images (fallback)
  return `${baseUrl}/${img.replace(/^\//, "")}`;
};
  const totalPrice =
    bookingType === 'seat' 
      ? property.perSeatPrice * seatCount * Number(stayDuration || 1)
      : property.fullHousePrice * Number(stayDuration || 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-3">
        {/* PROPERTY DETAILS */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Main Image */}
            <div className="p-4">
              {property.houseImage ? (
                <img
                  src={getImage(property.houseImage)}
                  alt="House"
                  className="h-80 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center text-slate-400">
                  No main image
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
              {[...(property.indoorImages || []), ...(property.outdoorImages || [])]
                .length > 0 ? (
                [...(property.indoorImages || []), ...(property.outdoorImages || [])].map(
                  (img) => (
                    <img
                      key={img}
                      src={getImage(img)}
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

            {/* Info */}
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
                    Per Seat: ₹{property.perSeatPrice} | Full: ₹{property.fullHousePrice}
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

              {/* Facilities */}
              <div className="mt-6 border rounded-lg p-4">
                <h3 className="font-semibold mb-2">House Facilities</h3>

                <p>Kitchen: {property.kitchen}</p>
                <p>Bathroom: {property.bathroom}</p>
                <p>Toilet: {property.toilet}</p>
                <p>
                  Electricity:{" "}
                  {property.electricityFree === "yes"
                    ? "Free"
                    : "Extra Charges"}
                </p>
                <p>
                  Water:{" "}
                  {property.waterFree === "yes" ? "Free" : "Extra Charges"}
                </p>
              </div>

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
              {/* Booking type */}
              <div>
                <label className="text-sm font-medium">Booking Type</label>

                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="fullRoom">Full Room</option>
                  <option value="seat">Single Seat</option>
                </select>
              </div>

              {/* Seat count */}
              {bookingType === "seat" && (
                <div>
                  <label className="text-sm font-medium">Seats</label>

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
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Seat
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* Visit date */}
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              {/* Stay duration */}
              <input
                type="number"
                min={property.minimumStay}
                max={property.maximumStay}
                value={stayDuration}
                onChange={(e) => setStayDuration(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              {/* Members */}
              {members.map((member, index) => (
                <div key={index} className="border p-3 rounded">
                  <p className="text-sm font-semibold">
                    Member {index + 1}
                  </p>

                  <input
                    placeholder="Profession"
                    className="w-full border rounded px-2 py-1 mt-1"
                    onChange={(e) => {
                      const updated = [...members];
                      updated[index].profession = e.target.value;
                      setMembers(updated);
                    }}
                  />

                  <input
                    placeholder="Workplace"
                    className="w-full border rounded px-2 py-1 mt-2"
                    onChange={(e) => {
                      const updated = [...members];
                      updated[index].workplace = e.target.value;
                      setMembers(updated);
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full border rounded px-2 py-1 mt-2"
                    onChange={(e) => {
                      const updated = [...members];
                      updated[index].age = e.target.value;
                      setMembers(updated);
                    }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        const updated = [...members];
                        updated[index].passportPhoto = reader.result;
                        setMembers(updated);
                      };

                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              ))}

              {/* Price */}
              <div className="bg-slate-100 p-3 rounded text-sm">
                <p>Per Seat: ₹{property.perSeatPrice} | Full: ₹{property.fullHousePrice}</p>
                <p>Seats: {seatCount}</p>
                <p>Months: {stayDuration}</p>

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