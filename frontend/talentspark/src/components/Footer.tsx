function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-leaf">🍃</span>
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="footer-brand">TalentSpark</span>. All rights
          reserved.
        </p>
        <span className="footer-leaf">🌿</span>
      </div>
    </footer>
  );
}

export default Footer;
