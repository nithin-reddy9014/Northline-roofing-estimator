import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [config, setConfig] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const owner = JSON.parse(localStorage.getItem("owner") || "{}");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [leadsResponse, configResponse] = await Promise.all([
        api.get("/owner/leads"),
        api.get("/owner/config"),
      ]);

      setLeads(leadsResponse.data.leads || []);
      setConfig(configResponse.data.config);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = (field, value) => {
    setConfig((previous) => ({
      ...previous,
      business: {
        ...previous.business,
        [field]: value,
      },
    }));
  };

  const updateModifier = (field, value) => {
    setConfig((previous) => ({
      ...previous,
      modifiers: {
        ...previous.modifiers,
        [field]: Number(value),
      },
    }));
  };

  const updateQuestion = (index, field, value) => {
    setConfig((previous) => {
      const questions = [...previous.questions];

      questions[index] = {
        ...questions[index],
        [field]: field === "active" ? value : value,
      };

      return {
        ...previous,
        questions,
      };
    });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setConfig((previous) => {
      const questions = [...previous.questions];

      const options = [...questions[questionIndex].options];

      options[optionIndex] = {
        ...options[optionIndex],
        [field]:
          field === "rate_per_sqft" ||
          field === "multiplier" ||
          field === "tear_off_per_sqft"
            ? Number(value)
            : value,
      };

      questions[questionIndex] = {
        ...questions[questionIndex],
        options,
      };

      return {
        ...previous,
        questions,
      };
    });
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put("/owner/config", config);

      setConfig(response.data.config);

      setMessage("Configuration saved successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("owner");

    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Owner Dashboard</span>

            <h1>Welcome, {owner.name || "Owner"}</h1>
          </div>

          <button className="back-button" onClick={logout}>
            Logout
          </button>
        </header>

        {message && <div className="success-message">{message}</div>}

        {error && <div className="error-message">{error}</div>}

        {/* BUSINESS */}

        {config && (
          <>
            <section className="dashboard-card">
              <h2>Business Settings</h2>

              <div className="form-grid">
                <label>
                  Business Name
                  <input
                    value={config.business?.name || ""}
                    onChange={(e) => updateBusiness("name", e.target.value)}
                  />
                </label>

                <label>
                  Region
                  <input
                    value={config.business?.region || ""}
                    onChange={(e) => updateBusiness("region", e.target.value)}
                  />
                </label>

                <label>
                  Currency
                  <input
                    value={config.business?.currency || ""}
                    onChange={(e) => updateBusiness("currency", e.target.value)}
                  />
                </label>
              </div>
            </section>

            {/* QUESTIONS */}

            <section className="dashboard-card">
              <div className="section-header">
                <div>
                  <h2>Estimator Questions</h2>

                  <p>Edit labels, options and pricing.</p>
                </div>
              </div>

              {config.questions?.map((question, questionIndex) => (
                <div className="question-editor" key={question.key}>
                  <div className="question-header">
                    <div>
                      <strong>{question.key}</strong>

                      <span>{question.type}</span>
                    </div>

                    <label className="active-toggle">
                      <input
                        type="checkbox"
                        checked={question.active !== false}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "active",
                            e.target.checked,
                          )
                        }
                      />
                      Active
                    </label>
                  </div>

                  <label>
                    Question Label
                    <input
                      value={question.label || ""}
                      onChange={(e) =>
                        updateQuestion(questionIndex, "label", e.target.value)
                      }
                    />
                  </label>

                  {question.options?.map((option, optionIndex) => (
                    <div className="option-editor" key={option.value}>
                      <input
                        value={option.label || ""}
                        onChange={(e) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            "label",
                            e.target.value,
                          )
                        }
                      />

                      {option.rate_per_sqft !== undefined && (
                        <input
                          type="number"
                          step="0.01"
                          value={option.rate_per_sqft}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              "rate_per_sqft",
                              e.target.value,
                            )
                          }
                        />
                      )}

                      {option.multiplier !== undefined && (
                        <input
                          type="number"
                          step="0.01"
                          value={option.multiplier}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              "multiplier",
                              e.target.value,
                            )
                          }
                        />
                      )}

                      {option.tear_off_per_sqft !== undefined && (
                        <input
                          type="number"
                          step="0.01"
                          value={option.tear_off_per_sqft}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              "tear_off_per_sqft",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </section>

            {/* MODIFIERS */}

            <section className="dashboard-card">
              <h2>Pricing Modifiers</h2>

              <div className="form-grid">
                <label>
                  Waste Factor
                  <input
                    type="number"
                    step="0.01"
                    value={config.modifiers?.waste_factor || 0}
                    onChange={(e) =>
                      updateModifier("waste_factor", e.target.value)
                    }
                  />
                </label>

                <label>
                  Permit Flat Fee
                  <input
                    type="number"
                    value={config.modifiers?.permit_flat_fee || 0}
                    onChange={(e) =>
                      updateModifier("permit_flat_fee", e.target.value)
                    }
                  />
                </label>

                <label>
                  Range Spread %
                  <input
                    type="number"
                    value={config.modifiers?.range_spread_pct || 0}
                    onChange={(e) =>
                      updateModifier("range_spread_pct", e.target.value)
                    }
                  />
                </label>
              </div>
            </section>

            <button
              className="primary-button save-button"
              onClick={saveConfig}
              disabled={saving}>
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </>
        )}

        {/* LEADS */}

        <section className="dashboard-card">
          <div className="section-header">
            <div>
              <h2>Leads</h2>

              <p>Customers who submitted estimates.</p>
            </div>

            <strong>{leads.length} Leads</strong>
          </div>

          {leads.length === 0 ? (
            <div className="empty-state">
              <h3>No leads yet</h3>
              <p>Submitted estimates will appear here.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Estimate</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>

                      <td>{lead.phone}</td>

                      <td>{lead.email}</td>

                      <td>
                        ${lead.estimate_low?.toLocaleString()}
                        {" - "}${lead.estimate_high?.toLocaleString()}
                      </td>

                      <td>
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
      </div>
    </div>
  );
}

export default OwnerDashboard;
