import React from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="auth-hero-wrap">
      <div className="auth-hero-content">
        <div className="auth-hero-badge">Live chat • Groups • Sharing</div>
        <div className="auth-hero-grid">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`auth-hero-grid-cell ${
                i % 2 === 0 ? "auth-hero-grid-cell-active" : ""
              }`}
            />
          ))}
        </div>

        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
