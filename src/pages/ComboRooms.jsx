import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ComboSection from "./ComboSection";

const ComboRooms = () => {
  const { type } = useParams(); // room | flat | intern
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState("");

  const loadCombo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/properties/combo", { params: { type } });
      setProperties(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombo();
  }, [type]);

  const filteredProperties = properties.filter((p) =>
    p.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const getTitle = () => {
    if (!type) return "Combo Properties";
    if (type === "room") return "Combo Rooms";
    if (type === "flat") return "Combo Flats";
    if (type === "intern") return "Combo Intern Houses";
    return "Combo Properties";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            {getTitle()}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mt-3 animate-fade-in delay-100">
            Explore partially booked {type} properties with available seats.
          </p>
        </div>

        {/* Search by City */}
        <div className="max-w-md mx-auto mb-12 animate-fade-in delay-200">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search by city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-3xl bg-white/30 backdrop-blur-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 text-lg transition-all duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="text-center text-slate-500 py-16 animate-pulse text-lg">
            Loading combo properties…
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 mx-auto max-w-md shadow-lg animate-fade-in">
            {error}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              No {type} properties found
            </h2>
            <p className="text-slate-600 mb-6">
              Try searching in a different city or check back later.
            </p>
          </div>
        ) : (
          <ComboSection
            properties={filteredProperties}
            title={`${getTitle()}`}
          />
        )}
      </div>
    </main>
  );
};

export default ComboRooms;