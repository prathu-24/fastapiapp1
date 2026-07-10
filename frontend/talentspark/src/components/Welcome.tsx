import { useState } from "react";

function Welcome() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">🍃 Growing Talent Naturally</div>
        <h1>Discover Your Next Great Hire</h1>
        <p>
          TalentSpark connects you with top companies and exceptional talent.
          Let your career bloom with the right opportunity.
        </p>

        <div className="counter-display">
          <button className="btn-logout btn-sm" onClick={increment}>🌿 Spark it</button>
          <span className="count-value">{count}</span>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">150+</span>
            <span className="stat-label">Companies</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">2.4K</span>
            <span className="stat-label">Open Roles</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">98%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;