import { useState } from "react";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      loginUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-logo">EP</div>
          <div>
            <h1>Employee Portal</h1>
            <p>Secure Zoho-integrated workspace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {error && <div className="error">{error}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-box">
          <strong>Demo Accounts</strong>

          <div>Admin: admin@example.com</div>
          <div>HR: hr@example.com</div>
          <div>Sales: sales@example.com</div>
          <div>Support: support@example.com</div>
          <div>Finance: finance@example.com</div>

          <small>Passwords are configured in the backend.</small>
        </div>
      </div>
    </div>
  );
}