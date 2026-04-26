import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";

export default function DashboardPage() {
  const [data, setData] = useState({
    summary: null,
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="panel">Loading summary...</div>;
  }

  const summary = data.summary || {
    projectCount: 0,
    consultantCount: 0,
    activeProjects: 0,
  };

  return (
    <div className="page-grid">
      <section className="stats-grid">
        <article className="stat-card accent-amber">
          <span>Total projects</span>
          <strong>{summary.projectCount}</strong>
        </article>
        <article className="stat-card accent-slate">
          <span>Consultants</span>
          <strong>{summary.consultantCount}</strong>
        </article>
        <article className="stat-card accent-green">
          <span>Active projects</span>
          <strong>{summary.activeProjects}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent projects</h2>
          <Link to="/projects" className="text-link">
            View all
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Consultant</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/projects/${project.id}`}>{project.shortName}</Link>
                  </td>
                  <td>{project.status}</td>
                  <td>{project.consultant?.shortName || "Unassigned"}</td>
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
