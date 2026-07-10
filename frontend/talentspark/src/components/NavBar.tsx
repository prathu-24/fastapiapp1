import { useEffect, useState } from "react";

function NavBar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "companies", "jobs", "contact"];
      const scrollPos = window.scrollY + 100; // offset

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <a href="#home" className="navbar-brand" onClick={(e) => handleNavClick(e, "home")}>
        <span className="brand-icon">🌿</span>
        TalentSpark
      </a>
      <ul className="navbar-links">
        <li className={activeSection === "home" ? "active" : ""}>
          <a href="#home" onClick={(e) => handleNavClick(e, "home")}>
            🏠 Home
          </a>
        </li>
        <li className={activeSection === "companies" ? "active" : ""}>
          <a href="#companies" onClick={(e) => handleNavClick(e, "companies")}>
            💼 Companies
          </a>
        </li>
        <li className={activeSection === "jobs" ? "active" : ""}>
          <a href="#jobs" onClick={(e) => handleNavClick(e, "jobs")}>
            📋 Jobs
          </a>
        </li>
        <li className={activeSection === "contact" ? "active" : ""}>
          <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>
            📞 Contact
          </a>
        </li>
      </ul>
      <div className="navbar-actions" />
    </nav>
  );
}

export default NavBar;