import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    loginMode: "user",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-panel auth-copy">
        <p className="eyebrow">React + Express + MongoDB</p>
        <h1>Run every construction project from one live dashboard.</h1>
        <p>
          Track consultants, contract dates, project value, active status, and
          followers from a cleaner modern stack.
        </p>
      </section>

      <section className="auth-panel auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <div className="login-mode-switch" role="tablist" aria-label="Login mode">
            <button
              type="button"
              className={form.loginMode === "user" ? "mode-pill active" : "mode-pill"}
              onClick={() =>
                setForm((current) => ({ ...current, loginMode: "user" }))
              }
            >
              User Login
            </button>
            <button
              type="button"
              className={form.loginMode === "admin" ? "mode-pill active" : "mode-pill"}
              onClick={() =>
                setForm((current) => ({ ...current, loginMode: "admin" }))
              }
            >
              Admin Login
            </button>
          </div>
          <p className="login-mode-copy">
            {form.loginMode === "admin"
              ? "Use the fixed admin account to open the admin portal and full project overview."
              : "Use a regular project account to access the dashboard and daily workflows."}
          </p>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting
              ? "Signing in..."
              : form.loginMode === "admin"
                ? "Enter admin portal"
                : "Enter dashboard"}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
