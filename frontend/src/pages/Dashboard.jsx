import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getPeople,
  getCRM,
  getDesk,
  getBooks,
} from "../services/api";

const services = [
  {
    key: "people",
    role: "HR",
    icon: "👥",
    title: "Zoho People",
    description: "Employee and HR management",
    function: getPeople,
    available: true,
  },
  {
    key: "crm",
    role: "Sales",
    icon: "📊",
    title: "Zoho CRM",
    description: "Customer and sales management",
    available: false,
  },
  {
    key: "desk",
    role: "Support",
    icon: "🎧",
    title: "Zoho Desk",
    description: "Customer support and tickets",
    available: false,
  },
  {
    key: "books",
    role: "Finance",
    icon: "💰",
    title: "Zoho Books",
    description: "Finance and accounting",
    available: false,
  },
];

export default function Dashboard({ onAdmin }) {
  const { user, logout } = useAuth();

  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = user?.roles || [];
  const isAdmin = roles.includes("Admin");

  function hasAccess(role) {
    return isAdmin || roles.includes(role);
  }

  async function openService(service) {
    if (!service.available) {
      setSelected(service.key);
      setResult({
        success: false,
        error: `${service.title} integration is currently pending configuration.`,
      });
      return;
    }

    setSelected(service.key);
    setLoading(true);
    setResult(null);

    try {
      const data = await service.function();

      setResult({
        success: true,
        data,
      });
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-logo small">EP</div>

          <div>
            <strong>Employee Portal</strong>
            <span>Zoho One Integration</span>
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{roles.join(", ")}</span>
          </div>

          {isAdmin && (
            <button className="admin-button" onClick={onAdmin}>
              Admin Console
            </button>
          )}

          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome">
          <div>
            <p className="eyebrow">EMPLOYEE WORKSPACE</p>
            <h1>Welcome, {user?.name}</h1>
            <p>
              Access the business services assigned to your role.
            </p>
          </div>

          <div className="role-badge">
            {roles.join(" • ")}
          </div>
        </section>

        <section>
          <div className="section-title">
            <h2>Business Services</h2>
            <span>Role-based access</span>
          </div>

          <div className="service-grid">
            {services
              .filter((service) => hasAccess(service.role))
              .map((service) => (
                <div
                  className={`service-card ${
                    selected === service.key ? "selected" : ""
                  }`}
                  key={service.key}
                >
                  <div className="service-top">
                    <div className="service-icon">
                      {service.icon}
                    </div>

                    <span
                      className={
                        service.available
                          ? "access-badge"
                          : "pending-badge"
                      }
                    >
                      {service.available ? "Access Granted" : "Access Granted"}
                    </span>
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <div className="service-footer">
                    <span>{service.role} access</span>

                    <button
                      onClick={() => openService(service)}
                    >
                     {service.available
  ? "Open →"
  : "Service Access →"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="response-card">
          <div className="section-title">
            <h2>Service Response</h2>

            {selected && (
              <span>
                {selected.toUpperCase()}
              </span>
            )}
          </div>

          {loading && (
            <div className="loading">
              Connecting to Zoho...
            </div>
          )}

          {!loading && !result && (
            <div className="empty-state">
              Select a service above to view its status.
            </div>
          )}

          {!loading && result && (
            <>
              <div
                className={
                  result.success
                    ? "response-success"
                    : "response-error"
                }
              >
                {result.success
                  ? "✓ Request completed successfully"
                  : `⚠ ${result.error}`}
              </div>

              <pre>
                {JSON.stringify(
                  result.success
                    ? result.data
                    : result.error,
                  null,
                  2
                )}
              </pre>
            </>
          )}
        </section>
      </main>
    </div>
  );
}