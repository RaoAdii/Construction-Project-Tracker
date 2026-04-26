import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  jobTitle: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-panel auth-copy">
        <p className="eyebrow">Stack migration complete</p>
        <h1>Create a team workspace for project delivery and field reporting.</h1>
        <p>
          The new platform replaces Django templates with a faster React client
          and a Mongo-backed API layer.
        </p>
      </section>

      <section className="auth-panel auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <label>
            Full name
            <input
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({ ...current, fullName: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({ ...current, username: event.target.value }))
              }
              required
            />
          </label>
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
            Job title
            <input
              value={form.jobTitle}
              onChange={(event) =>
                setForm((current) => ({ ...current, jobTitle: event.target.value }))
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
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              required
              minLength={8}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create workspace access"}
          </button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Back to login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
