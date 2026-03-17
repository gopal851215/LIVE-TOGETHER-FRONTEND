import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ComboSection from "./ComboSection";

const ComboHome = () => {
  const [roomProperties, setRoomProperties] = useState([]);
  const [flatProperties, setFlatProperties] = useState([]);
  const [internProperties, setInternProperties] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCombos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roomRes, flatRes, internRes] = await Promise.all([
          api.get("/properties/combo", { params: { type: "room" } }),
          api.get("/properties/combo", { params: { type: "flat" } }),
          api.get("/properties/combo", { params: { type: "intern" } }),
        ]);
        setRoomProperties(roomRes.data || []);
        setFlatProperties(flatRes.data || []);
        setInternProperties(internRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCombos();
  }, []);

  const filteredRoomProperties = roomProperties.filter((p) =>
    p.city.toLowerCase().includes(searchCity.toLowerCase())
  );
  const filteredFlatProperties = flatProperties.filter((p) =>
    p.city.toLowerCase().includes(searchCity.toLowerCase())
  );
  const filteredInternProperties = internProperties.filter((p) =>
    p.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const noResults =
    filteredRoomProperties.length === 0 &&
    filteredFlatProperties.length === 0 &&
    filteredInternProperties.length === 0;

  if (loading)
    return (
      <div className="text-center py-24 text-slate-500 animate-pulse text-xl">
        Loading combo properties...
      </div>
    );

  if (error)
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 mx-auto max-w-md shadow-lg">
        {error}
      </div>
    );

  return (
    <main className="relative bg-gradient-to-b from-slate-50 to-white min-h-screen py-16 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-20 rounded-3xl bg-white/20 backdrop-blur-xl p-12 text-center shadow-2xl animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            Combo Properties
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in delay-100">
            Find partially occupied rooms, flats, and intern houses. See current
            occupants and available seats instantly.
          </p>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto animate-fade-in delay-200">
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
              className="w-full pl-12 pr-8 py-4 border-2 border-slate-200 rounded-3xl bg-white/30 backdrop-blur-lg shadow-lg focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none text-lg transition-all duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Combo Sections */}
        <div className="space-y-24">
          {filteredRoomProperties.length > 0 && (
            <section>
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                  🏠 Combo Rooms
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
                  {filteredRoomProperties.length} available seats in shared rooms
                </p>
              </div>
              <ComboSection
                properties={filteredRoomProperties}
                title="Rooms"
              />
            </section>
          )}

          {filteredFlatProperties.length > 0 && (
            <section>
              <div className="text-center mb-12 animate-fade-in delay-100">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-4">
                  🏢 Combo Flats
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
                  {filteredFlatProperties.length} flats with available spaces
                </p>
              </div>
              <ComboSection
                properties={filteredFlatProperties}
                title="Flats"
              />
            </section>
          )}

          {filteredInternProperties.length > 0 && (
            <section>
              <div className="text-center mb-12 animate-fade-in delay-200">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-4">
                  💼 Combo Intern Rooms
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
                  {filteredInternProperties.length} short-term intern stays
                </p>
              </div>
              <ComboSection
                properties={filteredInternProperties}
                title="Intern Rooms"
              />
            </section>
          )}

          {noResults && (
            <div className="text-center py-24 animate-fade-in">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg animate-bounce">
                <svg
                  className="w-16 h-16 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                No Combo Properties Found
              </h3>
              <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
                No matching combo properties in your search. Try a different city
                or check back later.
              </p>
              <Link
                to="/rooms"
                className="inline-block bg-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-orange-600 transition shadow-lg"
              >
                Browse All Rooms
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ComboHome;