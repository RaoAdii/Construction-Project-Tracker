import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/projects")
      .then((response) => setProjects(response.data.projects))
      .finally(() => setLoading(false));
  }, []);

  async function toggleFollow(projectId) {
    const response = await api.post(`/projects/${projectId}/follow`);
    const following = response.data.following;

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const followers = Array.isArray(project.followers) ? project.followers : [];
        const alreadyFollowing = followers.includes(user.id);

        return {
          ...project,
          followers: following
            ? alreadyFollowing
              ? followers
              : [...followers, user.id]
            : followers.filter((followerId) => followerId !== user.id),
        };
      })
    );
  }

  if (loading) {
    return <div className="panel">Loading projects...</div>;
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Projects</h2>
        <Link to="/projects/new" className="primary-link-button">
          Create project
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Consultant</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const followers = Array.isArray(project.followers)
                ? project.followers
                : [];
              const isFollowing = followers.includes(user.id);

              return (
                <tr key={project.id}>
                  <td>
                    <Link to={`/projects/${project.id}`}>{project.shortName}</Link>
                  </td>
                  <td>{project.constructionType}</td>
                  <td>{project.status}</td>
                  <td>{project.consultant?.shortName || "Unassigned"}</td>
                  <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => toggleFollow(project.id)}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
