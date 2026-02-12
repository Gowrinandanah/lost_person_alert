import { AlertTriangle, ShieldCheck, Users } from "lucide-react";

const Home = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <section className="text-center py-24 px-6">
        <h1 className="text-4xl font-bold text-gray-800">
          SafeReturn
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          A community-driven platform helping families reconnect with
          missing loved ones through verified alerts and responsible collaboration.
        </p>

        {/* CENTERED LARGE BUTTONS */}
        <div className="mt-12 flex justify-center gap-8">
          <button
            onClick={() => onNavigate("report")}
            className="w-72 h-14 bg-indigo-600 text-white text-lg font-semibold rounded-md"
          >
            Report Lost Person
          </button>

          <button
            onClick={() => onNavigate("alerts")}
            className="w-72 h-14 bg-indigo-600 text-white text-lg font-semibold rounded-md"
          >
            View Active Alerts
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-14">
          How It Works
        </h2>

        {/* TRUE SIDE BY SIDE */}
        <div className="flex justify-center gap-10 max-w-6xl mx-auto">

          {/* CARD 1 */}
          <div className="w-80 border rounded-lg p-8 text-center shadow-sm">
            <AlertTriangle className="mx-auto mb-6 text-indigo-600" size={36} />
            <h3 className="text-xl font-semibold mb-3">
              Submit a Report
            </h3>
            <p className="text-gray-600">
              Provide details and last seen information about the missing person.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="w-80 border rounded-lg p-8 text-center shadow-sm">
            <ShieldCheck className="mx-auto mb-6 text-indigo-600" size={36} />
            <h3 className="text-xl font-semibold mb-3">
              Verification
            </h3>
            <p className="text-gray-600">
              Reports are reviewed and validated to ensure authenticity.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="w-80 border rounded-lg p-8 text-center shadow-sm">
            <Users className="mx-auto mb-6 text-indigo-600" size={36} />
            <h3 className="text-xl font-semibold mb-3">
              Community Support
            </h3>
            <p className="text-gray-600">
              Verified alerts are shared so the community can assist responsibly.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
