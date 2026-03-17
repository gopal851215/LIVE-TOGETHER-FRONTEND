import { Link } from "react-router-dom";
import { FaUserGraduate, FaHome, FaBriefcase } from "react-icons/fa";

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero Section */}
      <section className="grid gap-12 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-snug">
            Find the perfect <span className="text-brand-600">student housing</span> or intern room.
          </h1>
          <p className="text-slate-700 text-lg">
            Browse rooms, flats, and dedicated intern accommodation. Hosts can list properties, manage bookings, and accept new guests.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to="/rooms"
              className="rounded-2xl bg-brand-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-brand-700 hover:scale-105 transition transform"
            >
              Browse Rooms
            </Link>
            <Link
              to="/dashboard"
              className="rounded-2xl border border-slate-200 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 hover:scale-105 transition transform"
            >
              Host Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-tr from-brand-50 to-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How it works</h2>
          <ol className="space-y-6 text-slate-700">
            <li className="flex items-start gap-4">
              <span className="text-brand-600 mt-1"><FaUserGraduate /></span>
              <div>
                <p className="font-semibold">Register as a guest or host</p>
                <p className="text-sm text-slate-600">Sign up easily and get started within minutes.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-brand-600 mt-1"><FaHome /></span>
              <div>
                <p className="font-semibold">List your property</p>
                <p className="text-sm text-slate-600">Hosts can list rooms, flats, and intern stays with detailed info.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-brand-600 mt-1"><FaBriefcase /></span>
              <div>
                <p className="font-semibold">Guests book & confirm</p>
                <p className="text-sm text-slate-600">Book full rooms or single seats and manage bookings easily.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mt-20 grid gap-8 md:grid-cols-3">
        {[
          {
            title: "Rooms",
            description: "Search for shared rooms with seat-level booking options.",
            link: "/rooms",
            icon: <FaUserGraduate className="text-3xl text-brand-600" />,
          },
          {
            title: "Flats",
            description: "Find full flats (1BHK-3BHK) perfect for groups or individuals.",
            link: "/flats",
            icon: <FaHome className="text-3xl text-blue-500" />,
          },
          {
            title: "Intern Rooms",
            description: "Short-term stays (1-3 months) for interns.",
            link: "/intern-rooms",
            icon: <FaBriefcase className="text-3xl text-green-500" />,
          },
        ].map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
            <p className="text-slate-600 mb-4">{card.description}</p>
            <span className="text-brand-600 font-semibold hover:underline">
              Browse {card.title} →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Home;