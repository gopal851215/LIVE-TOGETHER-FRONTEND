
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";

const PropertyList = ({ typeLabel, typeFilter }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("girls");

  const loadProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      const city = searchParams.get("city");
      if (city) params.city = city;
      const res = await api.get("/properties", { params });
      setProperties(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [typeFilter, searchParams.toString()]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (value) setSearchParams({ city: value });
    else setSearchParams({});
  };

  const sections = [
    { id: "girls", title: "Girls Rooms", color: "from-pink-400 to-rose-500" },
    { id: "boys", title: "Boys Rooms", color: "from-blue-400 to-indigo-500" },
    { id: "family", title: "Family Rooms", color: "from-emerald-400 to-green-500" },
    { id: "anyone", title: "Anyone Rooms", color: "from-purple-400 to-violet-500" },
  ];

  const currentProperties = properties.filter((p) => {
    switch (activeSection) {
      case "girls": return p.allowedFor === "girls";
      case "boys": return p.allowedFor === "boys";
      case "family": return p.allowedFor === "family";
      case "anyone": return p.allowedFor === "anyone";
      default: return true;
    }
  });

  if (loading) return <div className="text-center py-20 text-slate-500 animate-pulse text-xl">Loading premium rooms...</div>;
  if (error) return <div className="rounded-md bg-red-50 p-8 text-center text-red-700">{error}</div>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      
      {/* Hero Section */}
      <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-extrabold drop-shadow-2xl md:text-6xl">
            🏠 {typeLabel}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl drop-shadow-lg">
            Explore premium {typeLabel.toLowerCase()} with modern amenities. Filter by city and gender.
          </p>
          <input
            value={searchParams.get("city") || ""}
            onChange={handleCityChange}
            placeholder="🔍 Search by city (e.g., Bangalore, Mumbai)"
            className="mx-auto w-full max-w-md rounded-3xl bg-white/20 px-6 py-4 text-lg text-white placeholder-white/70 backdrop-blur-xl focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
          />
        </div>
      </div>

      {/* Sections Tabs */}
      <div className="mb-12 flex flex-wrap justify-center gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`relative rounded-full px-8 py-3 font-semibold transition-all duration-300 group ${
              activeSection === section.id
                ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-${section.color.replace("from-", "")}/40`
                : "bg-white/80 text-slate-700 hover:bg-white shadow-md hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            }`}
          >
            <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 shadow-md">
              {properties.filter((p) => p.allowedFor === section.id).length}
            </span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Properties Grid */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProperties.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 p-16 text-center shadow-2xl animate-fade-in">
            <div className="mx-auto w-32 h-32 mb-6 rounded-3xl bg-white/50 flex items-center justify-center backdrop-blur-xl shadow-lg">
              <span className="text-4xl animate-bounce">🏠</span>
            </div>
            <h2 className="mb-4 text-3xl font-black text-slate-800">
              No rooms found
            </h2>
            <p className="text-xl text-slate-600 max-w-md mx-auto">
              No {activeSection} rooms available for your filters. Try searching in another city or section.
            </p>
          </div>
        ) : (
          currentProperties.map((property, idx) => (
            <div
              key={property._id}
              className={`group relative animate-in slide-in-from-bottom-${idx % 4 + 1} duration-700 hover:scale-105 hover:shadow-2xl transition-all`}
            >
              <PropertyCard property={property} />
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default PropertyList;