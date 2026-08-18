import { useEffect, useState } from "react";
import api from "../services/api";
import "./Estimator.css";

function Estimator() {
  const [configuration, setConfiguration] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState(null);

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const loadConfiguration = async () => {
    try {
      const response = await api.get("/config");
      setConfiguration(response.data);
    } catch {
      setError("Unable to load estimator");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadConfiguration();
    })();
  }, []);

  const activeQuestions =
    configuration?.questions?.filter((question) => question.active) || [];

  const currentQuestion = activeQuestions[step];

  const handleAnswerChange = (key, value) => {
    setAnswers((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;

    setContact((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (!currentQuestion) return;

    const answer = answers[currentQuestion.key];

    if (currentQuestion.required && (answer === undefined || answer === "")) {
      setError("Please answer this question before continuing.");
      return;
    }

    setError("");
    setStep((previous) => previous + 1);
  };

  const previousStep = () => {
    setError("");
    setStep((previous) => previous - 1);
  };

  const submitLead = async () => {
    if (!contact.name || !contact.phone || !contact.email) {
      setError("Please enter your name, phone and email.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/leads", {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        answers,
      });

      setEstimate(response.data.lead);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to generate estimate.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="estimator-page">
        <div className="estimator-card">
          <p>Loading estimator...</p>
        </div>
      </div>
    );
  }

  if (!configuration) {
    return (
      <div className="estimator-page">
        <div className="estimator-card">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (estimate) {
    return (
      <div className="estimator-page">
        <div className="estimator-card result-card">
          <span className="eyebrow">Your Roofing Estimate</span>

          <h1>Estimated Project Cost</h1>

          <p>
            Based on the information you provided, your estimated roofing
            project range is:
          </p>

          <div className="estimate-range">
            <div className="estimate-box">
              <span>Estimated Low</span>

              <strong>${estimate.estimate_low.toLocaleString()}</strong>
            </div>

            <div className="estimate-box">
              <span>Estimated High</span>

              <strong>${estimate.estimate_high.toLocaleString()}</strong>
            </div>
          </div>

          <p className="estimate-note">
            This is an estimate based on the information provided and may change
            after an on-site inspection.
          </p>
        </div>
      </div>
    );
  }

  const totalSteps = activeQuestions.length + 1;
  const isContactStep = step === activeQuestions.length;

  return (
    <div className="estimator-page">
      <div className="estimator-card">
        <div className="estimator-header">
          <span className="eyebrow">Roofing Cost Estimator</span>

          <h1>{configuration.business.name}</h1>

          <p>Get a quick estimate for your roofing project.</p>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span>
              Step {step + 1} of {totalSteps}
            </span>

            <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((step + 1) / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        {!isContactStep && currentQuestion && (
          <div className="question-section">
            <h2>{currentQuestion.label}</h2>

            {currentQuestion.unit && (
              <p className="unit">Enter value in {currentQuestion.unit}</p>
            )}

            {currentQuestion.type === "number" && (
              <input
                className="estimator-input"
                type="number"
                value={answers[currentQuestion.key] || ""}
                min={currentQuestion.min}
                max={currentQuestion.max}
                onChange={(event) =>
                  handleAnswerChange(currentQuestion.key, event.target.value)
                }
                placeholder="Enter value"
              />
            )}

            {currentQuestion.type === "select" && (
              <div className="options">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      answers[currentQuestion.key] === option.value
                        ? "option selected"
                        : "option"
                    }
                    onClick={() =>
                      handleAnswerChange(currentQuestion.key, option.value)
                    }>
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="error">{error}</p>}

            <div className="navigation">
              {step > 0 ? (
                <button
                  type="button"
                  className="back-button"
                  onClick={previousStep}>
                  ← Back
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                className="primary-button"
                onClick={nextStep}>
                Next →
              </button>
            </div>
          </div>
        )}

        {isContactStep && (
          <div className="contact-section">
            <h2>Where should we send your estimate?</h2>

            <p className="contact-description">
              Enter your contact details to receive your roofing estimate.
            </p>

            <input
              className="estimator-input"
              type="text"
              name="name"
              placeholder="Full name"
              value={contact.name}
              onChange={handleContactChange}
            />

            <input
              className="estimator-input"
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={contact.phone}
              onChange={handleContactChange}
            />

            <input
              className="estimator-input"
              type="email"
              name="email"
              placeholder="Email address"
              value={contact.email}
              onChange={handleContactChange}
            />

            {error && <p className="error">{error}</p>}

            <div className="navigation">
              <button
                type="button"
                className="back-button"
                onClick={previousStep}>
                ← Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={submitLead}
                disabled={submitting}>
                {submitting ? "Calculating..." : "Get My Estimate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Estimator;
