import { useState } from "react";
import PropertyCard from "../components/PropertyCard";

const ComboSection = ({ properties, title }) => {
  const [activeTab, setActiveTab] = useState("girls");

  const tabs = [
    { id: "girls", label: "Girls", color: "from-pink-400 to-rose-500" },
    { id: "boys", label: "Boys", color: "from-blue-400 to-indigo-500" },
    { id: "family", label: "Family", color: "from-emerald-400 to-green-500" },
    { id: "anyone", label: "Anyone", color: "from-purple-400 to-violet-500" },
  ];

  const filteredProperties = properties.filter((p) => {
    if (activeTab === "girls") return p.allowedFor === "girls";
    if (activeTab === "boys") return p.allowedFor === "boys";
    if (activeTab === "family") return p.allowedFor === "family";
    return p.allowedFor === "anyone";
  });

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">{title}</h2>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/20 backdrop-blur-lg p-1 rounded-full shadow-md">
          {tabs.map((tab) => {
            const count = properties.filter((p) => p.allowedFor === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/30"
                }`}
              >
                {tab.label}
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-xs font-bold`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-lg animate-fade-in">
          No {activeTab} properties available
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {filteredProperties.map((property, idx) => (
            <div
              key={property._id}
              className={`group animate-in slide-in-from-bottom-${(idx % 4) + 1} duration-700 hover:scale-105 hover:shadow-2xl transition-all`}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboSection;