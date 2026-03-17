import { useNavigate } from "react-router-dom";

const ComboLanding = () => {
  const navigate = useNavigate();

  const comboTypes = [
    { title: "Combo Rooms", type: "room", color: "from-orange-400 to-orange-600", icon: "🏠" },
    { title: "Combo Flats", type: "flat", color: "from-blue-400 to-blue-600", icon: "🏢" },
    { title: "Combo Intern Houses", type: "intern", color: "from-green-400 to-green-600", icon: "💼" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
          Combo Properties
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mt-4 animate-fade-in delay-100">
          Explore partially booked rooms, flats, and intern houses with available seats.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 animate-fade-in delay-200">
        {comboTypes.map((combo) => (
          <div
            key={combo.type}
            onClick={() => navigate(`/combo/${combo.type}`)}
            className={`cursor-pointer rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl bg-gradient-to-br ${combo.color} text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 group`}
          >
            <div className="text-6xl mb-4 animate-bounce">{combo.icon}</div>
            <h2 className="text-2xl font-bold mb-2 text-center group-hover:underline">
              {combo.title}
            </h2>
            <p className="text-center text-sm md:text-base text-white/80">
              See partially booked {combo.title.toLowerCase()} and available seats.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ComboLanding;