import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (!user) {
    return <Login />;
  }

  if (page === "admin" && user.roles?.includes("Admin")) {
    return <Admin onBack={() => setPage("dashboard")} />;
  }

  return (
    <Dashboard
      onAdmin={() => setPage("admin")}
    />
  );
}

export default App;