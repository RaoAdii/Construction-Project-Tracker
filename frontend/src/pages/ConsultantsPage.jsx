import { useEffect, useState } from "react";
import api from "../lib/api.js";

const initialForm = {
  fullName: "",
  shortName: "",
  description: "",
};

function dedupeConsultants(consultants) {
  const seen = new Set();

  return consultants.filter((consultant) => {
    const key = `${consultant.shortName}`.trim().toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/consultants").then((response) => {
      setConsultants(dedupeConsultants(response.data.consultants));
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/consultants", form);
      setConsultants((current) =>
        dedupeConsultants(
          [...current, response.data.consultant].sort((a, b) =>
            a.shortName.localeCompare(b.shortName)
          )
        )
      );
      setForm(initialForm);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not save consultant."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-grid two-column-layout">
      <section className="panel">
        <div className="section-heading">
          <h2>Consultants</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Short name</th>
                <th>Full name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {consultants.map((consultant) => (
                <tr key={consultant._id}>
                  <td>{consultant.shortName}</td>
                  <td>{consultant.fullName}</td>
                  <td>{consultant.description || "No description"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Add consultant</h2>
        </div>

        <form className="project-form single-column-form" onSubmit={handleSubmit}>
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
            Short name
            <input
              value={form.shortName}
              onChange={(event) =>
                setForm((current) => ({ ...current, shortName: event.target.value }))
              }
              required
            />
          </label>

          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="actions-row">
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save consultant"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
