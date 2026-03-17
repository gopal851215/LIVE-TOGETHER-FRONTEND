import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const seatsAvailable = property.availableSeats ?? 0;
  const isCombo = property.allowedMembers > seatsAvailable && seatsAvailable > 0;

  const imageSource =
    property.houseImage ||
    property.indoorImages?.[0] ||
    property.outdoorImages?.[0] ||
    property.images?.[0];

  const imgSrc =
    imageSource?.startsWith("http") || imageSource?.startsWith("data:")
      ? imageSource
      : `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${imageSource?.replace(/^\//, "")}`;

  return (
    <Link
      to={`/properties/${property._id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-transform hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-48 w-full bg-slate-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={property.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/400x220?text=No+image";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 font-medium">
            No Image
          </div>
        )}
        {/* Combo Badge */}
        {isCombo && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 shadow">
            Combo
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
            {property.title}
          </h3>
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {property.type}
          </span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-1">
          {property.location}, {property.city}
        </p>

        <p className="text-sm text-slate-600">
₹{property.perSeatPrice?.toLocaleString() ?? '0'}/mo | Full: ₹{property.fullHousePrice?.toLocaleString() ?? '0'}
          </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 text-xs mt-2">
          <span className="rounded-full bg-brand-50 px-2 py-1 text-brand-700">{property.bhkType || "1BHK"}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">Allowed: {property.allowedMembers}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">Available: {seatsAvailable}</span>
        </div>

        {/* Occupants */}
        {isCombo && property.occupants?.length > 0 && (
          <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 space-y-2">
            <p className="font-semibold">Current booking{property.occupants.length > 1 ? "s" : ""} ({property.occupants.reduce((sum, occ) => sum + (occ.seatsBooked || 1), 0)} seats):</p>
            {property.occupants.slice(0, 2).map((occ, idx) => (
              <div key={idx} className="space-y-0.5 border-b border-amber-100 pb-1 last:border-none">
                <p className="font-semibold">
                  {occ.guest?.name || "Guest"}
                  {occ.seatsBooked > 1 && ` (${occ.seatsBooked} seats)`}
                </p>
                {occ.professionalInfo?.profession && <p>Profession: {occ.professionalInfo.profession}</p>}
                {occ.professionalInfo?.workplace && <p>Workplace: {occ.professionalInfo.workplace}</p>}
                {occ.professionalInfo?.age && <p>Age: {occ.professionalInfo.age}</p>}
                <p className="text-[11px] text-amber-800">Leaving: {new Date(occ.leaveDate).toLocaleDateString()}</p>
              </div>
            ))}
            {property.occupants.length > 2 && (
              <p className="mt-1 text-[11px] font-medium text-amber-800">
                +{property.occupants.length - 2} more booking{property.occupants.length - 2 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;