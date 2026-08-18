import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [configResponse, leadsResponse] = await Promise.all([
          api.get("/api/config"),
          api.get("/api/leads"),
        ]);

        setConfig(configResponse.data);
        setLeads(leadsResponse.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message || "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Northline Roofing</h1>
            <p className="text-sm text-gray-400">Owner Dashboard</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Total Leads</p>

            <h2 className="text-3xl font-bold mt-2">{leads.length}</h2>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Estimator Questions</p>

            <h2 className="text-3xl font-bold mt-2">
              {config?.questions?.length || 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Roofing Materials</p>

            <h2 className="text-3xl font-bold mt-2">
              {config?.materials?.length || 0}
            </h2>
          </div>
        </div>

        {/* Configuration */}
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Estimator Configuration</h2>

            <p className="text-sm text-gray-400 mt-1">
              Current roofing estimator configuration.
            </p>
          </div>

          {config ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400">Questions</p>

                <p className="text-2xl font-semibold mt-1">
                  {config.questions?.length || 0}
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400">Materials</p>

                <p className="text-2xl font-semibold mt-1">
                  {config.materials?.length || 0}
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400">Roof Pitches</p>

                <p className="text-2xl font-semibold mt-1">
                  {config.pitches?.length || 0}
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400">Layers</p>

                <p className="text-2xl font-semibold mt-1">
                  {config.layers?.length || 0}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No configuration available.</p>
          )}
        </section>

        {/* Leads */}
        <section className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Recent Leads</h2>

            <p className="text-sm text-gray-400 mt-1">
              Customers who submitted an estimate request.
            </p>
          </div>

          {leads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No leads available yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium">Name</th>

                    <th className="px-6 py-4 text-sm font-medium">Email</th>

                    <th className="px-6 py-4 text-sm font-medium">Phone</th>

                    <th className="px-6 py-4 text-sm font-medium">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-6 py-4">{lead.name || "-"}</td>

                      <td className="px-6 py-4 text-gray-300">
                        {lead.email || "-"}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {lead.phone || "-"}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
