import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api.js";

function buildMaterialStats(project) {
  const materials = project.materials || {};
  const usageLog = materials.usageLog || [];

  const totalsUsed = usageLog.reduce(
    (accumulator, item) => ({
      cement: accumulator.cement + (item.cementUsed || 0),
      bricks: accumulator.bricks + (item.bricksUsed || 0),
      steelBars: accumulator.steelBars + (item.steelBarsUsed || 0),
      other: accumulator.other + (item.otherUsed || 0),
    }),
    { cement: 0, bricks: 0, steelBars: 0, other: 0 }
  );

  return [
    { key: "cement", label: "Cement", unit: "bags" },
    { key: "bricks", label: "Bricks", unit: "units" },
    { key: "steelBars", label: "Steel bars", unit: "units" },
    { key: "other", label: "Other materials", unit: "units" },
  ].map((item) => {
    const left = Number(materials[item.key] || 0);
    const used = Number(totalsUsed[item.key] || 0);
    const total = left + used;
    const leftPercent = total > 0 ? Math.round((left / total) * 100) : 0;

    return {
      ...item,
      left,
      used,
      total,
      leftPercent,
    };
  });
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [entry, setEntry] = useState({
    date: new Date().toISOString().slice(0, 10),
    cementUsed: "",
    bricksUsed: "",
    steelBarsUsed: "",
    otherUsed: "",
    labourCharge: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function fetchProject() {
    api.get(`/projects/${id}`).then((response) => setProject(response.data.project));
  }

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, [id]);

  if (!project) {
    return <div className="panel">Loading project...</div>;
  }
  const materialStats = buildMaterialStats(project);

  async function handleEntrySubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/projects/${id}/materials`, {
        ...entry,
        cementUsed: Number(entry.cementUsed || 0),
        bricksUsed: Number(entry.bricksUsed || 0),
        steelBarsUsed: Number(entry.steelBarsUsed || 0),
        otherUsed: Number(entry.otherUsed || 0),
        labourCharge: Number(entry.labourCharge || 0),
      });
      setEntry({
        date: new Date().toISOString().slice(0, 10),
        cementUsed: "",
        bricksUsed: "",
        steelBarsUsed: "",
        otherUsed: "",
        labourCharge: "",
        note: "",
      });
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add entry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-heading">
          <h2>{project.fullName}</h2>
          <Link to={`/projects/${project.id}/edit`} className="primary-link-button">
            Edit project
          </Link>
        </div>


        <div className="detail-grid">
          <div>
            <span className="detail-label">Short name</span>
            <strong>{project.shortName}</strong>
          </div>
          <div>
            <span className="detail-label">Employer</span>
            <strong>{project.employer}</strong>
          </div>
          <div>
            <span className="detail-label">Consultant</span>
            <strong>{project.consultant?.fullName || "Unassigned"}</strong>
          </div>
          <div>
            <span className="detail-label">Contract amount</span>
            <strong>${Number(project.contractAmount).toLocaleString()}</strong>
          </div>
          <div>
            <span className="detail-label">Construction type</span>
            <strong>{project.constructionType}</strong>
          </div>
          <div>
            <span className="detail-label">Status</span>
            <strong>{project.status}</strong>
          </div>
          <div>
            <span className="detail-label">Commencement</span>
            <strong>{new Date(project.commencementDate).toLocaleDateString()}</strong>
          </div>
          <div>
            <span className="detail-label">Completion target</span>
            <strong>
              {project.completionDate
                ? new Date(project.completionDate).toLocaleDateString()
                : "N/A"}
            </strong>
          </div>
          <div>
            <span className="detail-label">Cement (bags)</span>
            <strong>{project.materials?.cement ?? 0}</strong>
          </div>
          <div>
            <span className="detail-label">Bricks (units)</span>
            <strong>{project.materials?.bricks ?? 0}</strong>
          </div>
          <div>
            <span className="detail-label">Steel bars (units)</span>
            <strong>{project.materials?.steelBars ?? 0}</strong>
          </div>
          <div>
            <span className="detail-label">Other materials (units)</span>
            <strong>{project.materials?.other ?? 0}</strong>
          </div>
        </div>

        <div className="material-summary-block">
          <div className="section-heading">
            <h3>Material Left</h3>
          </div>
          <p className="material-summary-copy">
            Live stock view showing what is left on site and how much has already
            been used.
          </p>

          <div className="material-visual-grid">
            {materialStats.map((item) => (
              <article key={item.key} className="material-card">
                <div
                  className="material-pie"
                  style={{
                    background: `conic-gradient(var(--green) 0 ${item.leftPercent}%, rgba(31, 41, 51, 0.14) ${item.leftPercent}% 100%)`,
                  }}
                >
                  <div className="material-pie-center">
                    <strong>{item.leftPercent}%</strong>
                    <span>left</span>
                  </div>
                </div>

                <div className="material-card-body">
                  <h4>{item.label}</h4>
                  <p>
                    {item.left} {item.unit} left out of {item.total} {item.unit}
                  </p>
                  <p className="material-meta">
                    Used: {item.used} {item.unit}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="usage-log-block">
          <h3>Daily Material & Labour Usage</h3>
          <form className="usage-entry-form" onSubmit={handleEntrySubmit}>
            <label className="usage-field usage-field-neutral">
              Date
              <input
                type="date"
                value={entry.date}
                onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                required
              />
            </label>
            <label className="usage-field usage-field-cement">
              Cement used
              <input
                type="number"
                min="0"
                max={project.materials?.cement ?? 0}
                value={entry.cementUsed}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setEntry({ ...entry, cementUsed: "" });
                    return;
                  }
                  const limit = project.materials?.cement ?? 0;
                  setEntry({
                    ...entry,
                    cementUsed: String(
                      Math.max(0, Math.min(Number(value), limit))
                    ),
                  });
                }}
                required
              />
              <small className="usage-availability">
                Available: {project.materials?.cement ?? 0}
              </small>
            </label>
            <label className="usage-field usage-field-bricks">
              Bricks used
              <input
                type="number"
                min="0"
                max={project.materials?.bricks ?? 0}
                value={entry.bricksUsed}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setEntry({ ...entry, bricksUsed: "" });
                    return;
                  }
                  const limit = project.materials?.bricks ?? 0;
                  setEntry({
                    ...entry,
                    bricksUsed: String(
                      Math.max(0, Math.min(Number(value), limit))
                    ),
                  });
                }}
                required
              />
              <small className="usage-availability">
                Available: {project.materials?.bricks ?? 0}
              </small>
            </label>
            <label className="usage-field usage-field-steel">
              Steel bars used
              <input
                type="number"
                min="0"
                max={project.materials?.steelBars ?? 0}
                value={entry.steelBarsUsed}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setEntry({ ...entry, steelBarsUsed: "" });
                    return;
                  }
                  const limit = project.materials?.steelBars ?? 0;
                  setEntry({
                    ...entry,
                    steelBarsUsed: String(
                      Math.max(0, Math.min(Number(value), limit))
                    ),
                  });
                }}
                required
              />
              <small className="usage-availability">
                Available: {project.materials?.steelBars ?? 0}
              </small>
            </label>
            <label className="usage-field usage-field-other">
              Other materials used
              <input
                type="number"
                min="0"
                max={project.materials?.other ?? 0}
                value={entry.otherUsed}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setEntry({ ...entry, otherUsed: "" });
                    return;
                  }
                  const limit = project.materials?.other ?? 0;
                  setEntry({
                    ...entry,
                    otherUsed: String(
                      Math.max(0, Math.min(Number(value), limit))
                    ),
                  });
                }}
                required
              />
              <small className="usage-availability">
                Available: {project.materials?.other ?? 0}
              </small>
            </label>
            <label className="usage-field usage-field-labour">
              Labour charge
              <input
                type="number"
                min="0"
                value={entry.labourCharge}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setEntry({ ...entry, labourCharge: "" });
                    return;
                  }
                  setEntry({
                    ...entry,
                    labourCharge: String(Math.max(0, Number(value))),
                  });
                }}
                required
              />
            </label>
            <label className="usage-field usage-field-note usage-field-full">
              Note
              <input
                type="text"
                value={entry.note}
                onChange={(e) => setEntry({ ...entry, note: e.target.value })}
                placeholder="Add a short note about today's site work"
              />
            </label>
            {error && <div className="form-error usage-form-error">{error}</div>}
            <div className="actions-row usage-actions">
              <button type="submit" disabled={submitting} className="usage-submit">
                {submitting ? "Saving..." : "Add Entry"}
              </button>
            </div>
          </form>
          {project.materials?.usageLog?.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Cement</th>
                  <th>Bricks</th>
                  <th>Steel Bars</th>
                  <th>Other</th>
                  <th>Labour Charge</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {project.materials.usageLog.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>{entry.cementUsed}</td>
                    <td>{entry.bricksUsed}</td>
                    <td>{entry.steelBarsUsed}</td>
                    <td>{entry.otherUsed}</td>
                    <td>{entry.labourCharge}</td>
                    <td>{entry.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
         </div>

        <div className="description-block">
          <span className="detail-label">Description</span>
          <p>{project.description || "No description provided."}</p>
        </div>
      </section>
    </div>
  );
}
