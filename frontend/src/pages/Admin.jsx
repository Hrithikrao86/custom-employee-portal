import { useEffect, useState } from "react";
import { getUsers, getAuditLogs } from "../services/api";

export default function Admin({ onBack }) {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    setError("");

    try {
      const [usersData, logsData] = await Promise.all([
        getUsers(),
        getAuditLogs(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
      setLogs(Array.isArray(logsData) ? logsData : logsData.logs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Admin Console</h1>
          <p>Manage users and monitor portal activity.</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Dashboard
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading admin-loading">
          Loading administration data...
        </div>
      ) : (
        <>
          <section className="admin-card">
            <div className="section-title">
              <h2>Users</h2>
              <span>{users.length} users</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>

                      <td>{item.email}</td>

                      <td>
                        {item.userRoles
                          ?.map((r) => r.role.name)
                          .join(", ") || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            item.isActive
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <div className="section-title">
              <h2>Activity & Audit Logs</h2>
              <span>{logs.length} records</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>IP Address</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user?.email || "System"}</td>
                      <td>{log.action}</td>
                      <td>{log.resource || "-"}</td>
                      <td>{log.ipAddress || "-"}</td>
                      <td>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {logs.length === 0 && (
              <div className="empty-state">
                No audit activity recorded yet.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}