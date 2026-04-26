import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProjectsPage from "./pages/AdminProjectsPage.jsx";
import ConsultantsPage from "./pages/ConsultantsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ProjectFormPage from "./pages/ProjectFormPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="screen-center">Loading...</div>;
  }

  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/landing" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="admin/projects"
          element={
            <AdminRoute>
              <AdminProjectsPage />
            </AdminRoute>
          }
        />
        <Route path="consultants" element={<ConsultantsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectFormPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/:id/edit" element={<ProjectFormPage />} />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
