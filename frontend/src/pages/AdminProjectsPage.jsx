import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";

function getStatusCount(projects, status) {
  return projects.filter((project) => project.status === status).length;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/projects")
      .then((response) => setProjects(response.data.projects))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="panel">Loading admin projects...</div>;
  }

  const activeCount = getStatusCount(projects, "active");
  const mobilizationCount = getStatusCount(projects, "mobilization");
  const suspendedCount = getStatusCount(projects, "suspended");
  const closedCount = getStatusCount(projects, "closed");

  return (
    <div className="page-grid admin-page-grid">
      <section className="admin-hero">
        <div className="section-heading">
          <div>
            <p className="eyebrow admin-eyebrow">Admin Portal</p>
            <h2>Portfolio Control Center</h2>
            <p className="admin-hero-copy">
              Monitor every project in one place, spot portfolio risks, and jump
              straight into the work that needs attention.
            </p>
          </div>
          <Link to="/projects/new" className="primary-link-button">
            Add project
          </Link>
        </div>

        <div className="admin-hero-metrics">
          <article className="admin-metric admin-metric-total">
            <span>Total portfolio</span>
            <strong>{projects.length}</strong>
          </article>
          <article className="admin-metric admin-metric-active">
            <span>Active delivery</span>
            <strong>{activeCount}</strong>
          </article>
          <article className="admin-metric admin-metric-mobilization">
            <span>Mobilization</span>
            <strong>{mobilizationCount}</strong>
          </article>
        </div>
      </section>

      <section className="admin-overview-grid">
        <article className="admin-status-panel">
          <div className="section-heading">
            <h3>Status breakdown</h3>
          </div>
          <div className="admin-status-list">
            <div className="admin-status-row">
              <span>Active projects</span>
              <strong>{activeCount}</strong>
            </div>
            <div className="admin-status-row">
              <span>Mobilization</span>
              <strong>{mobilizationCount}</strong>
            </div>
            <div className="admin-status-row">
              <span>Suspended</span>
              <strong>{suspendedCount}</strong>
            </div>
            <div className="admin-status-row">
              <span>Closed</span>
              <strong>{closedCount}</strong>
            </div>
          </div>
        </article>

        <article className="admin-status-panel admin-status-panel-muted">
          <div className="section-heading">
            <h3>Admin focus</h3>
          </div>
          <div className="admin-focus-copy">
            <p>Use this view to review project ownership, consultant coverage, and portfolio movement across statuses.</p>
            <p>Each row below is designed for fast oversight rather than day-to-day field entry.</p>
          </div>
        </article>
      </section>

      <section className="panel admin-table-panel">
        <div className="section-heading">
          <h3>All Projects Overview</h3>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Type</th>
                <th>Consultant</th>
                <th>Created by</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/projects/${project.id}`}>{project.shortName}</Link>
                  </td>
                  <td>{project.status}</td>
                  <td>{project.constructionType}</td>
                  <td>{project.consultant?.shortName || "Unassigned"}</td>
                  <td>{project.createdBy?.fullName || project.createdBy?.username || "Unknown"}</td>
                  <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
