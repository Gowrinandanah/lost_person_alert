import ReportForm from "../components/forms/ReportForm";

const ReportLostPerson = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Report Missing Person
        </h2>
        <ReportForm />
      </div>
    </div>
  );
};

export default ReportLostPerson;