import { NavLink, Outlet } from "react-router-dom";
import { FaPlus, FaList, FaEnvelope, FaCheckCircle } from "react-icons/fa";

const HostDashboard = () => {
  const menuItems = [
    { to: "add", label: "Add Room / Flat", icon: <FaPlus className="inline mr-2" /> },
    { to: "listings", label: "Manage Listings", icon: <FaList className="inline mr-2" /> },
    { to: "requests", label: "Booking Requests", icon: <FaEnvelope className="inline mr-2" /> },
    { to: "confirmed", label: "Confirmed Bookings", icon: <FaCheckCircle className="inline mr-2" /> },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 lg:sticky lg:top-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Host Dashboard</h2>
            <nav className="space-y-2 text-sm">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-2 transition-all font-medium ${
                      isActive
                        ? "bg-brand-50 text-brand-700 border-l-4 border-brand-600 shadow-sm"
                        : "hover:bg-slate-50 text-slate-700"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default HostDashboard;