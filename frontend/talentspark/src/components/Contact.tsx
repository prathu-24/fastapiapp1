import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="companies-section" style={{ borderTop: "1px solid var(--border)", marginTop: "40px", paddingBottom: "80px" }}>
      <div className="section-header">
        <h2>📞 Contact TalentSpark</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "24px" }} className="contact-container">
        {/* Contact Info Card */}
        <div className="company-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h1>Get in Touch</h1>
            <p style={{ margin: "12px 0 24px 0", fontSize: "0.95rem" }}>
              Have questions about candidate applications, corporate partnerships, or pricing models? 
              Reach out to our specialists. We respond within 1 business day.
            </p>
            
            <div className="info-row">
              <span className="info-icon">📧</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)" }}>EMAIL SUPPORT</strong>
                <span>support@talentspark.com</span>
              </div>
            </div>
            
            <div className="info-row">
              <span className="info-icon">📱</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)" }}>PHONE</strong>
                <span>+1 (555) 019-9283</span>
              </div>
            </div>
            
            <div className="info-row">
              <span className="info-icon">📍</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)" }}>HEADQUARTERS</strong>
                <span>100 Innovation Way, Suite 400, Tech City</span>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "20px" }}>
            🌱 <em>"Connecting global talent organically."</em>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="add-company-section" style={{ marginTop: 0 }}>
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="e.g. jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Message</label>
              <textarea
                placeholder="How can we assist you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                style={{ resize: "none" }}
              />
            </div>
            
            <button className="btn btn-primary" type="submit" style={{ alignSelf: "flex-start", marginTop: "8px" }}>
              ✉️ Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
