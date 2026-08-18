import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("owner", JSON.stringify(response.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="estimator-page">
      <div className="estimator-card">
        <span className="eyebrow">Owner Portal</span>

        <h1>Welcome back</h1>

        <p>Sign in to manage your roofing estimator.</p>

        <form onSubmit={handleSubmit}>
          <input
            className="estimator-input"
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="estimator-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OwnerLogin;
