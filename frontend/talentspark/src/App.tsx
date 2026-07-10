
import './App.css'
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"
import ChatBot from "./components/ChatBot"
import Login from "./pages/Login";
import Register from "./pages/Register";
import FallingLeaves from "./components/FallingLeaves";
import Contact from "./components/Contact";
import { useEffect, useState } from "react";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "./services/CompanyService";
import type { company } from "./types/company";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [page, setPage] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [companies, setCompanies] = useState<company[]>([]);

  const handleLogin = (accessToken: string) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };

  async function fetchCompanies() {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      console.error("Failed to fetch companies", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  const handleEdit = async (company: company) => {
    try {
      await updateCompany(company.id, company);
      await fetchCompanies();
    } catch (error) {
      console.error("Failed to update company", error);
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCompany(id);
      await fetchCompanies();
    } catch (error) {
      console.error("Failed to delete company", error);
    }
  }

  const handleAdd = async (company: company) => {
    try {
      await createCompany(company);
      await fetchCompanies();
    } catch (error: any) {
      console.error("Failed to add company", error);
      alert("Failed to add company. Ensure you are logged in as an Administrator (admin role) and the email is unique.");
    }
  }

  // ---- Not logged in: show Login or Register ----
  if (!token) {
    if (page === "register") {
      return <Register onSwitchToLogin={() => setPage("login")} />;
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setPage("register")}
      />
    );
  }

  // ---- Logged in: show dashboard ----
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <span className="error-icon">⚠️</span>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <FallingLeaves />
      <NavBar />
      <button className="btn-logout" onClick={handleLogout} style={{ position: "fixed", top: 18, right: 28, zIndex: 200 }}>
        🚪 Logout
      </button>
      <div id="home">
        <Welcome />
      </div>
      <div id="companies">
        <CompanyCard
          companies={companies}
          onedit={handleEdit}
          ondelete={handleDelete}
          onadd={handleAdd}
        />
      </div>
      <div id="jobs">
        <JobCard />
      </div>
      <Contact />
      <Footer />
      <ChatBot />
    </>
  )
}
export default App
